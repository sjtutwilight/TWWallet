// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.10;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {GPv2SafeERC20} from "../helpers/GPv2SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import {IStableDebtToken} from "../../../interfaces/IStableDebtToken.sol";
import {IVariableDebtToken} from "../../../interfaces/IVariableDebtToken.sol";
import {IAToken} from "../../../interfaces/IAToken.sol";
import {UserConfiguration} from "../configuration/UserConfiguration.sol";
import {ReserveConfiguration} from "../configuration/ReserveConfiguration.sol";
import {Helpers} from "../helpers/Helpers.sol";
import {DataTypes} from "../types/DataTypes.sol";
import {ValidationLogic} from "./ValidationLogic.sol";
import {ReserveLogic} from "./ReserveLogic.sol";

library BorrowLogic {
    using ReserveLogic for DataTypes.ReserveCache;
    using ReserveLogic for DataTypes.ReserveData;
    using GPv2SafeERC20 for IERC20;
    using UserConfiguration for DataTypes.UserConfigurationMap;
    using ReserveConfiguration for DataTypes.ReserveConfigurationMap;
    using SafeCast for uint256;
    event Borrow(
        address indexed reserve,
        address user,
        address indexed onBehalfOf,
        uint256 amount,
        DataTypes.InterestRateMode interestRateMode,
        uint256 borrowRate
    );
    event Repay(
        address indexed reserve,
        address indexed user,
        address indexed repayer,
        uint256 amount,
        bool useATokens
    );
    function executeBorrow(
        mapping(address => DataTypes.ReserveData) storage reservesData,
        mapping(uint256 => address) storage reservesList,
        DataTypes.UserConfigurationMap storage userConfig,
        DataTypes.ExecuteBorrowParams memory params
    ) public {
        DataTypes.ReserveData storage reserve = reservesData[params.asset];
        DataTypes.ReserveCache memory reserveCache = reserve.cache();
        reserve.updateState(reserveCache);

        ValidationLogic.validateBorrow(
            reservesData,
            reservesList,
            DataTypes.ValidateBorrowParams({
                reserveCache: reserveCache,
                userConfig: userConfig,
                asset: params.asset,
                userAddress: params.onBehalfOf,
                amount: params.amount,
                interestRateMode: params.interestRateMode,
                reservesCount: params.reservesCount,
                oracle: params.oracle,
                priceOracleSentinel: params.priceOracleSentinel
            })
        );
        bool isFirstBorrowing = false;
        (
            isFirstBorrowing,
            reserveCache.nextScaledVariableDebt
        ) = IVariableDebtToken(reserveCache.variableDebtTokenAddress).mint(
            params.user,
            params.onBehalfOf,
            params.amount,
            reserveCache.nextVariableBorrowIndex
        );
        if (isFirstBorrowing) {
            userConfig.setBorrowing(reserve.id, true);
        }
        reserve.updateInterestRates(
            reserveCache,
            params.asset,
            0,
            params.releaseUnderlying ? params.amount : 0
        );
        if (params.releaseUnderlying) {
            IAToken(reserveCache.aTokenAddress).transferUnderlyingTo(
                params.user,
                params.amount
            );
        }
        emit Borrow(
            params.asset,
            params.user,
            params.onBehalfOf,
            params.amount,
            params.interestRateMode,
            reserve.currentVariableBorrowRate
        );
    }
    function executeRepay(
        mapping(address => DataTypes.ReserveData) storage reservesData,
        mapping(uint256 => address) storage reservesList,
        DataTypes.UserConfigurationMap storage userConfig,
        DataTypes.ExecuteRepayParams memory params
    ) external returns (uint256) {
        DataTypes.ReserveData storage reserve = reservesData[params.asset];
        DataTypes.ReserveCache memory reserveCache = reserve.cache();
        reserve.updateState(reserveCache);
        (, uint256 variableDebt) = Helpers.getUserCurrentDebt(
            params.onBehalfOf,
            reserveCache
        );
        ValidationLogic.validateRepay(
            reserveCache,
            params.amount,
            params.interestRateMode,
            params.onBehalfOf,
            variableDebt
        );
        uint256 paybackAmount = variableDebt;
        if (params.amount < paybackAmount) {
            paybackAmount = params.amount;
        }
        reserveCache.nextScaledVariableDebt = IVariableDebtToken(
            reserveCache.variableDebtTokenAddress
        ).burn(
                params.onBehalfOf,
                paybackAmount,
                reserveCache.nextVariableBorrowIndex
            );
        reserve.updateInterestRates(
            reserveCache,
            params.asset,
            paybackAmount,
            0
        );
        if (variableDebt == paybackAmount) {
            userConfig.setBorrowing(reserve.id, false);
        }
        IERC20(params.asset).safeTransfer(
            reserveCache.aTokenAddress,
            paybackAmount
        );
        emit Repay(
            params.asset,
            params.onBehalfOf,
            msg.sender,
            paybackAmount,
            params.useATokens
        );

        return paybackAmount;
    }
}
