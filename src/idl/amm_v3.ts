export type AmmV3 = {
  "version": "0.1.0",
  "name": "amm_v3",
  "instructions": [
    {
      "name": "createAmmConfig",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "ammConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u16"
        },
        {
          "name": "tickSpacing",
          "type": "u16"
        },
        {
          "name": "tradeFeeRate",
          "type": "u32"
        },
        {
          "name": "protocolFeeRate",
          "type": "u32"
        },
        {
          "name": "fundFeeRate",
          "type": "u32"
        }
      ]
    },
    {
      "name": "updateAmmConfig",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "ammConfig",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "param",
          "type": "u8"
        },
        {
          "name": "value",
          "type": "u32"
        }
      ]
    },
    {
      "name": "createPool",
      "accounts": [
        {
          "name": "poolCreator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint0",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint1",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "observationState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "sqrtPriceX64",
          "type": "u128"
        }
      ]
    },
    {
      "name": "resetSqrtPrice",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "observationState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "sqrtPriceX64",
          "type": "u128"
        }
      ]
    },
    {
      "name": "initializeReward",
      "accounts": [
        {
          "name": "rewardFunder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "funderTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "param",
          "type": {
            "defined": "InitializeRewardParam"
          }
        }
      ]
    },
    {
      "name": "collectRemainingRewards",
      "accounts": [
        {
          "name": "rewardFunder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "funderTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardTokenVault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "rewardIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "updateRewardInfos",
      "accounts": [
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setRewardParams",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "ammConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "rewardIndex",
          "type": "u8"
        },
        {
          "name": "emissionsPerSecondX64",
          "type": "u128"
        },
        {
          "name": "openTime",
          "type": "u64"
        },
        {
          "name": "endTime",
          "type": "u64"
        }
      ]
    },
    {
      "name": "collectProtocolFee",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount0Requested",
          "type": "u64"
        },
        {
          "name": "amount1Requested",
          "type": "u64"
        }
      ]
    },
    {
      "name": "collectFundFee",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount0Requested",
          "type": "u64"
        },
        {
          "name": "amount1Requested",
          "type": "u64"
        }
      ]
    },
    {
      "name": "openPosition",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "positionNftOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "positionNftMint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "positionNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "protocolPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArrayLower",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArrayUpper",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "personalPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tickLowerIndex",
          "type": "i32"
        },
        {
          "name": "tickUpperIndex",
          "type": "i32"
        },
        {
          "name": "tickArrayLowerStartIndex",
          "type": "i32"
        },
        {
          "name": "tickArrayUpperStartIndex",
          "type": "i32"
        },
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Max",
          "type": "u64"
        },
        {
          "name": "amount1Max",
          "type": "u64"
        }
      ]
    },
    {
      "name": "closePosition",
      "accounts": [
        {
          "name": "nftOwner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "positionNftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "positionNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "personalPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "increaseLiquidity",
      "accounts": [
        {
          "name": "nftOwner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "nftAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "protocolPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "personalPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArrayLower",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArrayUpper",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Max",
          "type": "u64"
        },
        {
          "name": "amount1Max",
          "type": "u64"
        }
      ]
    },
    {
      "name": "decreaseLiquidity",
      "accounts": [
        {
          "name": "nftOwner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "nftAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "personalPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "protocolPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArrayLower",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArrayUpper",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Min",
          "type": "u64"
        },
        {
          "name": "amount1Min",
          "type": "u64"
        }
      ]
    },
    {
      "name": "swap",
      "accounts": [
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "outputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inputVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "outputVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "observationState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tickArray",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "otherAmountThreshold",
          "type": "u64"
        },
        {
          "name": "sqrtPriceLimitX64",
          "type": "u128"
        },
        {
          "name": "isBaseInput",
          "type": "bool"
        }
      ]
    },
    {
      "name": "swapRouterBaseIn",
      "accounts": [
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "inputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amountIn",
          "type": "u64"
        },
        {
          "name": "amountOutMinimum",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "ammConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "index",
            "type": "u16"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "protocolFeeRate",
            "type": "u32"
          },
          {
            "name": "tradeFeeRate",
            "type": "u32"
          },
          {
            "name": "tickSpacing",
            "type": "u16"
          },
          {
            "name": "fundFeeRate",
            "type": "u32"
          },
          {
            "name": "paddingU32",
            "type": "u32"
          },
          {
            "name": "fundOwner",
            "type": "publicKey"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                3
              ]
            }
          }
        ]
      }
    },
    {
      "name": "observationState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initialized",
            "type": "bool"
          },
          {
            "name": "poolId",
            "type": "publicKey"
          },
          {
            "name": "observations",
            "type": {
              "array": [
                {
                  "defined": "Observation"
                },
                1000
              ]
            }
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u128",
                5
              ]
            }
          }
        ]
      }
    },
    {
      "name": "personalPositionState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "nftMint",
            "type": "publicKey"
          },
          {
            "name": "poolId",
            "type": "publicKey"
          },
          {
            "name": "tickLowerIndex",
            "type": "i32"
          },
          {
            "name": "tickUpperIndex",
            "type": "i32"
          },
          {
            "name": "liquidity",
            "type": "u128"
          },
          {
            "name": "feeGrowthInside0LastX64",
            "type": "u128"
          },
          {
            "name": "feeGrowthInside1LastX64",
            "type": "u128"
          },
          {
            "name": "tokenFeesOwed0",
            "type": "u64"
          },
          {
            "name": "tokenFeesOwed1",
            "type": "u64"
          },
          {
            "name": "rewardInfos",
            "type": {
              "array": [
                {
                  "defined": "PositionRewardInfo"
                },
                3
              ]
            }
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                8
              ]
            }
          }
        ]
      }
    },
    {
      "name": "poolState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "ammConfig",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "tokenMint0",
            "type": "publicKey"
          },
          {
            "name": "tokenMint1",
            "type": "publicKey"
          },
          {
            "name": "tokenVault0",
            "type": "publicKey"
          },
          {
            "name": "tokenVault1",
            "type": "publicKey"
          },
          {
            "name": "observationKey",
            "type": "publicKey"
          },
          {
            "name": "mintDecimals0",
            "type": "u8"
          },
          {
            "name": "mintDecimals1",
            "type": "u8"
          },
          {
            "name": "tickSpacing",
            "type": "u16"
          },
          {
            "name": "liquidity",
            "type": "u128"
          },
          {
            "name": "sqrtPriceX64",
            "type": "u128"
          },
          {
            "name": "tickCurrent",
            "type": "i32"
          },
          {
            "name": "observationIndex",
            "type": "u16"
          },
          {
            "name": "observationUpdateDuration",
            "type": "u16"
          },
          {
            "name": "feeGrowthGlobal0X64",
            "type": "u128"
          },
          {
            "name": "feeGrowthGlobal1X64",
            "type": "u128"
          },
          {
            "name": "protocolFeesToken0",
            "type": "u64"
          },
          {
            "name": "protocolFeesToken1",
            "type": "u64"
          },
          {
            "name": "swapInAmountToken0",
            "type": "u128"
          },
          {
            "name": "swapOutAmountToken1",
            "type": "u128"
          },
          {
            "name": "swapInAmountToken1",
            "type": "u128"
          },
          {
            "name": "swapOutAmountToken0",
            "type": "u128"
          },
          {
            "name": "status",
            "type": "u8"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                7
              ]
            }
          },
          {
            "name": "rewardInfos",
            "type": {
              "array": [
                {
                  "defined": "RewardInfo"
                },
                3
              ]
            }
          },
          {
            "name": "tickArrayBitmap",
            "type": {
              "array": [
                "u64",
                16
              ]
            }
          },
          {
            "name": "totalFeesToken0",
            "type": "u64"
          },
          {
            "name": "totalFeesClaimedToken0",
            "type": "u64"
          },
          {
            "name": "totalFeesToken1",
            "type": "u64"
          },
          {
            "name": "totalFeesClaimedToken1",
            "type": "u64"
          },
          {
            "name": "fundFeesToken0",
            "type": "u64"
          },
          {
            "name": "fundFeesToken1",
            "type": "u64"
          },
          {
            "name": "padding1",
            "type": {
              "array": [
                "u64",
                26
              ]
            }
          },
          {
            "name": "padding2",
            "type": {
              "array": [
                "u64",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "protocolPositionState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "poolId",
            "type": "publicKey"
          },
          {
            "name": "tickLowerIndex",
            "type": "i32"
          },
          {
            "name": "tickUpperIndex",
            "type": "i32"
          },
          {
            "name": "liquidity",
            "type": "u128"
          },
          {
            "name": "feeGrowthInside0LastX64",
            "type": "u128"
          },
          {
            "name": "feeGrowthInside1LastX64",
            "type": "u128"
          },
          {
            "name": "tokenFeesOwed0",
            "type": "u64"
          },
          {
            "name": "tokenFeesOwed1",
            "type": "u64"
          },
          {
            "name": "rewardGrowthInside",
            "type": {
              "array": [
                "u128",
                3
              ]
            }
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                8
              ]
            }
          }
        ]
      }
    },
    {
      "name": "tickArrayState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolId",
            "type": "publicKey"
          },
          {
            "name": "startTickIndex",
            "type": "i32"
          },
          {
            "name": "ticks",
            "type": {
              "array": [
                {
                  "defined": "TickState"
                },
                60
              ]
            }
          },
          {
            "name": "initializedTickCount",
            "type": "u8"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                115
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitializeRewardParam",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "openTime",
            "type": "u64"
          },
          {
            "name": "endTime",
            "type": "u64"
          },
          {
            "name": "emissionsPerSecondX64",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "Observation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "blockTimestamp",
            "type": "u32"
          },
          {
            "name": "sqrtPriceX64",
            "type": "u128"
          },
          {
            "name": "cumulativeTimePriceX64",
            "type": "u128"
          },
          {
            "name": "padding",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "PositionRewardInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "growthInsideLastX64",
            "type": "u128"
          },
          {
            "name": "rewardAmountOwed",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "RewardInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rewardState",
            "type": "u8"
          },
          {
            "name": "openTime",
            "type": "u64"
          },
          {
            "name": "endTime",
            "type": "u64"
          },
          {
            "name": "lastUpdateTime",
            "type": "u64"
          },
          {
            "name": "emissionsPerSecondX64",
            "type": "u128"
          },
          {
            "name": "rewardTotalEmissioned",
            "type": "u64"
          },
          {
            "name": "rewardClaimed",
            "type": "u64"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "tokenVault",
            "type": "publicKey"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "rewardGrowthGlobalX64",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "TickState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tick",
            "type": "i32"
          },
          {
            "name": "liquidityNet",
            "type": "i128"
          },
          {
            "name": "liquidityGross",
            "type": "u128"
          },
          {
            "name": "feeGrowthOutside0X64",
            "type": "u128"
          },
          {
            "name": "feeGrowthOutside1X64",
            "type": "u128"
          },
          {
            "name": "rewardGrowthsOutsideX64",
            "type": {
              "array": [
                "u128",
                3
              ]
            }
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u32",
                13
              ]
            }
          }
        ]
      }
    },
    {
      "name": "PoolStatusBitIndex",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "OpenPositionOrIncreaseLiquidity"
          },
          {
            "name": "DecreaseLiquidity"
          },
          {
            "name": "CollectFee"
          },
          {
            "name": "CollectReward"
          },
          {
            "name": "Swap"
          }
        ]
      }
    },
    {
      "name": "PoolStatusBitFlag",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Enable"
          },
          {
            "name": "Disable"
          }
        ]
      }
    },
    {
      "name": "RewardState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Uninitialized"
          },
          {
            "name": "Initialized"
          },
          {
            "name": "Opening"
          },
          {
            "name": "Ended"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "CreateConfigEvent",
      "fields": [
        {
          "name": "index",
          "type": "u16",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "protocolFeeRate",
          "type": "u32",
          "index": false
        },
        {
          "name": "tradeFeeRate",
          "type": "u32",
          "index": false
        },
        {
          "name": "tickSpacing",
          "type": "u16",
          "index": false
        },
        {
          "name": "fundFeeRate",
          "type": "u32",
          "index": false
        },
        {
          "name": "fundOwner",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "UpdaterConfigEvent",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "protocolFeeRate",
          "type": "u32",
          "index": false
        },
        {
          "name": "tradeFeeRate",
          "type": "u32",
          "index": false
        },
        {
          "name": "fundFeeRate",
          "type": "u32",
          "index": false
        },
        {
          "name": "fundOwner",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "CreatePersonalPositionEvent",
      "fields": [
        {
          "name": "poolState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "minter",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "nftOwner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tickLowerIndex",
          "type": "i32",
          "index": false
        },
        {
          "name": "tickUpperIndex",
          "type": "i32",
          "index": false
        },
        {
          "name": "liquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "depositAmount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "depositAmount1",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "IncreaseLiquidityEvent",
      "fields": [
        {
          "name": "positionNftMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "liquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "amount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount1",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "DecreaseLiquidityEvent",
      "fields": [
        {
          "name": "positionNftMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "liquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "decreaseAmount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "decreaseAmount1",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount1",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardAmounts",
          "type": {
            "array": [
              "u64",
              3
            ]
          },
          "index": false
        }
      ]
    },
    {
      "name": "CollectPersonalFeeEvent",
      "fields": [
        {
          "name": "positionNftMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "recipientTokenAccount0",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "recipientTokenAccount1",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount1",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateRewardInfosEvent",
      "fields": [
        {
          "name": "rewardGrowthGlobalX64",
          "type": {
            "array": [
              "u128",
              3
            ]
          },
          "index": false
        }
      ]
    },
    {
      "name": "PoolCreatedEvent",
      "fields": [
        {
          "name": "tokenMint0",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenMint1",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tickSpacing",
          "type": "u16",
          "index": false
        },
        {
          "name": "poolState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "sqrtPriceX64",
          "type": "u128",
          "index": false
        },
        {
          "name": "tick",
          "type": "i32",
          "index": false
        },
        {
          "name": "tokenVault0",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenVault1",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "CollectProtocolFeeEvent",
      "fields": [
        {
          "name": "poolState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "recipientTokenAccount0",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "recipientTokenAccount1",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount1",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "SwapEvent",
      "fields": [
        {
          "name": "poolState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "sender",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenAccount0",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenAccount1",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount1",
          "type": "u64",
          "index": false
        },
        {
          "name": "zeroForOne",
          "type": "bool",
          "index": false
        },
        {
          "name": "sqrtPriceX64",
          "type": "u128",
          "index": false
        },
        {
          "name": "liquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "tick",
          "type": "i32",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "LOK",
      "msg": "LOK"
    },
    {
      "code": 6001,
      "name": "NotApproved",
      "msg": "Not approved"
    },
    {
      "code": 6002,
      "name": "InvalidUpdateConfigFlag",
      "msg": "invalid update amm config flag"
    },
    {
      "code": 6003,
      "name": "AccountLack",
      "msg": "Account lack"
    },
    {
      "code": 6004,
      "name": "ClosePositionErr",
      "msg": "Remove liquitity, collect fees owed and reward then you can close position account"
    },
    {
      "code": 6005,
      "name": "ZeroMintAmount",
      "msg": "Minting amount should be greater than 0"
    },
    {
      "code": 6006,
      "name": "InvaildTickIndex",
      "msg": "Tick index of lower must be smaller than upper"
    },
    {
      "code": 6007,
      "name": "TickInvaildOrder",
      "msg": "The lower tick must be below the upper tick"
    },
    {
      "code": 6008,
      "name": "TickLowerOverflow",
      "msg": "The tick must be greater, or equal to the minimum tick(-221818)"
    },
    {
      "code": 6009,
      "name": "TickUpperOverflow",
      "msg": "The tick must be lesser than, or equal to the maximum tick(221818)"
    },
    {
      "code": 6010,
      "name": "TickAndSpacingNotMatch",
      "msg": "tick % tick_spacing must be zero"
    },
    {
      "code": 6011,
      "name": "InvalidTickArray",
      "msg": "Invaild tick array account"
    },
    {
      "code": 6012,
      "name": "SqrtPriceLimitOverflow",
      "msg": "Square root price limit overflow"
    },
    {
      "code": 6013,
      "name": "SqrtPriceX64",
      "msg": "sqrt_price_x64 out of range"
    },
    {
      "code": 6014,
      "name": "LiquiditySubValueErr",
      "msg": "Liquidity sub delta L must be smaller than before"
    },
    {
      "code": 6015,
      "name": "LiquidityAddValueErr",
      "msg": "Liquidity add delta L must be greater, or equal to before"
    },
    {
      "code": 6016,
      "name": "InvaildLiquidity",
      "msg": "Invaild liquidity when update position"
    },
    {
      "code": 6017,
      "name": "ForbidBothZeroForSupplyLiquidity",
      "msg": "Both token amount must not be zero while supply liquidity"
    },
    {
      "code": 6018,
      "name": "TransactionTooOld",
      "msg": "Transaction too old"
    },
    {
      "code": 6019,
      "name": "PriceSlippageCheck",
      "msg": "Price slippage check"
    },
    {
      "code": 6020,
      "name": "TooLittleOutputReceived",
      "msg": "Too little output received"
    },
    {
      "code": 6021,
      "name": "TooMuchInputPaid",
      "msg": "Too much input paid"
    },
    {
      "code": 6022,
      "name": "InvaildSwapAmountSpecified",
      "msg": "Swap special amount can not be zero"
    },
    {
      "code": 6023,
      "name": "InvalidInputPoolVault",
      "msg": "Input pool vault is invalid"
    },
    {
      "code": 6024,
      "name": "TooSmallInputOrOutputAmount",
      "msg": "Swap input or output amount is too small"
    },
    {
      "code": 6025,
      "name": "InvalidRewardIndex",
      "msg": "Invalid reward index"
    },
    {
      "code": 6026,
      "name": "FullRewardInfo",
      "msg": "The init reward token reach to the max"
    },
    {
      "code": 6027,
      "name": "RewardTokenAlreadyInUse",
      "msg": "The init reward token already in use"
    },
    {
      "code": 6028,
      "name": "ExceptPoolVaultMint",
      "msg": "The reward tokens must contain one of pool vault mint except the last reward"
    },
    {
      "code": 6029,
      "name": "InvalidRewardInitParam",
      "msg": "Invalid reward init param"
    },
    {
      "code": 6030,
      "name": "InvalidRewardDesiredAmount",
      "msg": "Invalid collect reward desired amount"
    },
    {
      "code": 6031,
      "name": "InvalidRewardInputAccountNumber",
      "msg": "Invalid collect reward input account number"
    },
    {
      "code": 6032,
      "name": "InvalidRewardPeriod",
      "msg": "Invalid reward period"
    },
    {
      "code": 6033,
      "name": "NotApproveUpdateRewardEmissiones",
      "msg": "Modification of emissiones is allowed within 72 hours from the end of the previous cycle"
    },
    {
      "code": 6034,
      "name": "UnInitializedRewardInfo",
      "msg": "uninitialized reward info"
    }
  ]
};

export const IDL: AmmV3 = {
  "version": "0.1.0",
  "name": "amm_v3",
  "instructions": [
    {
      "name": "createAmmConfig",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "ammConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u16"
        },
        {
          "name": "tickSpacing",
          "type": "u16"
        },
        {
          "name": "tradeFeeRate",
          "type": "u32"
        },
        {
          "name": "protocolFeeRate",
          "type": "u32"
        },
        {
          "name": "fundFeeRate",
          "type": "u32"
        }
      ]
    },
    {
      "name": "updateAmmConfig",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "ammConfig",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "param",
          "type": "u8"
        },
        {
          "name": "value",
          "type": "u32"
        }
      ]
    },
    {
      "name": "createPool",
      "accounts": [
        {
          "name": "poolCreator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint0",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint1",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "observationState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "sqrtPriceX64",
          "type": "u128"
        }
      ]
    },
    {
      "name": "resetSqrtPrice",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "observationState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "sqrtPriceX64",
          "type": "u128"
        }
      ]
    },
    {
      "name": "initializeReward",
      "accounts": [
        {
          "name": "rewardFunder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "funderTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "param",
          "type": {
            "defined": "InitializeRewardParam"
          }
        }
      ]
    },
    {
      "name": "collectRemainingRewards",
      "accounts": [
        {
          "name": "rewardFunder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "funderTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardTokenVault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "rewardIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "updateRewardInfos",
      "accounts": [
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setRewardParams",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "ammConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "rewardIndex",
          "type": "u8"
        },
        {
          "name": "emissionsPerSecondX64",
          "type": "u128"
        },
        {
          "name": "openTime",
          "type": "u64"
        },
        {
          "name": "endTime",
          "type": "u64"
        }
      ]
    },
    {
      "name": "collectProtocolFee",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount0Requested",
          "type": "u64"
        },
        {
          "name": "amount1Requested",
          "type": "u64"
        }
      ]
    },
    {
      "name": "collectFundFee",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount0Requested",
          "type": "u64"
        },
        {
          "name": "amount1Requested",
          "type": "u64"
        }
      ]
    },
    {
      "name": "openPosition",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "positionNftOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "positionNftMint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "positionNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "protocolPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArrayLower",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArrayUpper",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "personalPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tickLowerIndex",
          "type": "i32"
        },
        {
          "name": "tickUpperIndex",
          "type": "i32"
        },
        {
          "name": "tickArrayLowerStartIndex",
          "type": "i32"
        },
        {
          "name": "tickArrayUpperStartIndex",
          "type": "i32"
        },
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Max",
          "type": "u64"
        },
        {
          "name": "amount1Max",
          "type": "u64"
        }
      ]
    },
    {
      "name": "closePosition",
      "accounts": [
        {
          "name": "nftOwner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "positionNftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "positionNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "personalPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "increaseLiquidity",
      "accounts": [
        {
          "name": "nftOwner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "nftAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "protocolPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "personalPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArrayLower",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArrayUpper",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Max",
          "type": "u64"
        },
        {
          "name": "amount1Max",
          "type": "u64"
        }
      ]
    },
    {
      "name": "decreaseLiquidity",
      "accounts": [
        {
          "name": "nftOwner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "nftAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "personalPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "protocolPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArrayLower",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArrayUpper",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Min",
          "type": "u64"
        },
        {
          "name": "amount1Min",
          "type": "u64"
        }
      ]
    },
    {
      "name": "swap",
      "accounts": [
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "outputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inputVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "outputVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "observationState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tickArray",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "otherAmountThreshold",
          "type": "u64"
        },
        {
          "name": "sqrtPriceLimitX64",
          "type": "u128"
        },
        {
          "name": "isBaseInput",
          "type": "bool"
        }
      ]
    },
    {
      "name": "swapRouterBaseIn",
      "accounts": [
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "inputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amountIn",
          "type": "u64"
        },
        {
          "name": "amountOutMinimum",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "ammConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "index",
            "type": "u16"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "protocolFeeRate",
            "type": "u32"
          },
          {
            "name": "tradeFeeRate",
            "type": "u32"
          },
          {
            "name": "tickSpacing",
            "type": "u16"
          },
          {
            "name": "fundFeeRate",
            "type": "u32"
          },
          {
            "name": "paddingU32",
            "type": "u32"
          },
          {
            "name": "fundOwner",
            "type": "publicKey"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                3
              ]
            }
          }
        ]
      }
    },
    {
      "name": "observationState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initialized",
            "type": "bool"
          },
          {
            "name": "poolId",
            "type": "publicKey"
          },
          {
            "name": "observations",
            "type": {
              "array": [
                {
                  "defined": "Observation"
                },
                1000
              ]
            }
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u128",
                5
              ]
            }
          }
        ]
      }
    },
    {
      "name": "personalPositionState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "nftMint",
            "type": "publicKey"
          },
          {
            "name": "poolId",
            "type": "publicKey"
          },
          {
            "name": "tickLowerIndex",
            "type": "i32"
          },
          {
            "name": "tickUpperIndex",
            "type": "i32"
          },
          {
            "name": "liquidity",
            "type": "u128"
          },
          {
            "name": "feeGrowthInside0LastX64",
            "type": "u128"
          },
          {
            "name": "feeGrowthInside1LastX64",
            "type": "u128"
          },
          {
            "name": "tokenFeesOwed0",
            "type": "u64"
          },
          {
            "name": "tokenFeesOwed1",
            "type": "u64"
          },
          {
            "name": "rewardInfos",
            "type": {
              "array": [
                {
                  "defined": "PositionRewardInfo"
                },
                3
              ]
            }
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                8
              ]
            }
          }
        ]
      }
    },
    {
      "name": "poolState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "ammConfig",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "tokenMint0",
            "type": "publicKey"
          },
          {
            "name": "tokenMint1",
            "type": "publicKey"
          },
          {
            "name": "tokenVault0",
            "type": "publicKey"
          },
          {
            "name": "tokenVault1",
            "type": "publicKey"
          },
          {
            "name": "observationKey",
            "type": "publicKey"
          },
          {
            "name": "mintDecimals0",
            "type": "u8"
          },
          {
            "name": "mintDecimals1",
            "type": "u8"
          },
          {
            "name": "tickSpacing",
            "type": "u16"
          },
          {
            "name": "liquidity",
            "type": "u128"
          },
          {
            "name": "sqrtPriceX64",
            "type": "u128"
          },
          {
            "name": "tickCurrent",
            "type": "i32"
          },
          {
            "name": "observationIndex",
            "type": "u16"
          },
          {
            "name": "observationUpdateDuration",
            "type": "u16"
          },
          {
            "name": "feeGrowthGlobal0X64",
            "type": "u128"
          },
          {
            "name": "feeGrowthGlobal1X64",
            "type": "u128"
          },
          {
            "name": "protocolFeesToken0",
            "type": "u64"
          },
          {
            "name": "protocolFeesToken1",
            "type": "u64"
          },
          {
            "name": "swapInAmountToken0",
            "type": "u128"
          },
          {
            "name": "swapOutAmountToken1",
            "type": "u128"
          },
          {
            "name": "swapInAmountToken1",
            "type": "u128"
          },
          {
            "name": "swapOutAmountToken0",
            "type": "u128"
          },
          {
            "name": "status",
            "type": "u8"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                7
              ]
            }
          },
          {
            "name": "rewardInfos",
            "type": {
              "array": [
                {
                  "defined": "RewardInfo"
                },
                3
              ]
            }
          },
          {
            "name": "tickArrayBitmap",
            "type": {
              "array": [
                "u64",
                16
              ]
            }
          },
          {
            "name": "totalFeesToken0",
            "type": "u64"
          },
          {
            "name": "totalFeesClaimedToken0",
            "type": "u64"
          },
          {
            "name": "totalFeesToken1",
            "type": "u64"
          },
          {
            "name": "totalFeesClaimedToken1",
            "type": "u64"
          },
          {
            "name": "fundFeesToken0",
            "type": "u64"
          },
          {
            "name": "fundFeesToken1",
            "type": "u64"
          },
          {
            "name": "padding1",
            "type": {
              "array": [
                "u64",
                26
              ]
            }
          },
          {
            "name": "padding2",
            "type": {
              "array": [
                "u64",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "protocolPositionState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "poolId",
            "type": "publicKey"
          },
          {
            "name": "tickLowerIndex",
            "type": "i32"
          },
          {
            "name": "tickUpperIndex",
            "type": "i32"
          },
          {
            "name": "liquidity",
            "type": "u128"
          },
          {
            "name": "feeGrowthInside0LastX64",
            "type": "u128"
          },
          {
            "name": "feeGrowthInside1LastX64",
            "type": "u128"
          },
          {
            "name": "tokenFeesOwed0",
            "type": "u64"
          },
          {
            "name": "tokenFeesOwed1",
            "type": "u64"
          },
          {
            "name": "rewardGrowthInside",
            "type": {
              "array": [
                "u128",
                3
              ]
            }
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                8
              ]
            }
          }
        ]
      }
    },
    {
      "name": "tickArrayState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolId",
            "type": "publicKey"
          },
          {
            "name": "startTickIndex",
            "type": "i32"
          },
          {
            "name": "ticks",
            "type": {
              "array": [
                {
                  "defined": "TickState"
                },
                60
              ]
            }
          },
          {
            "name": "initializedTickCount",
            "type": "u8"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                115
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitializeRewardParam",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "openTime",
            "type": "u64"
          },
          {
            "name": "endTime",
            "type": "u64"
          },
          {
            "name": "emissionsPerSecondX64",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "Observation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "blockTimestamp",
            "type": "u32"
          },
          {
            "name": "sqrtPriceX64",
            "type": "u128"
          },
          {
            "name": "cumulativeTimePriceX64",
            "type": "u128"
          },
          {
            "name": "padding",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "PositionRewardInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "growthInsideLastX64",
            "type": "u128"
          },
          {
            "name": "rewardAmountOwed",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "RewardInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rewardState",
            "type": "u8"
          },
          {
            "name": "openTime",
            "type": "u64"
          },
          {
            "name": "endTime",
            "type": "u64"
          },
          {
            "name": "lastUpdateTime",
            "type": "u64"
          },
          {
            "name": "emissionsPerSecondX64",
            "type": "u128"
          },
          {
            "name": "rewardTotalEmissioned",
            "type": "u64"
          },
          {
            "name": "rewardClaimed",
            "type": "u64"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "tokenVault",
            "type": "publicKey"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "rewardGrowthGlobalX64",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "TickState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tick",
            "type": "i32"
          },
          {
            "name": "liquidityNet",
            "type": "i128"
          },
          {
            "name": "liquidityGross",
            "type": "u128"
          },
          {
            "name": "feeGrowthOutside0X64",
            "type": "u128"
          },
          {
            "name": "feeGrowthOutside1X64",
            "type": "u128"
          },
          {
            "name": "rewardGrowthsOutsideX64",
            "type": {
              "array": [
                "u128",
                3
              ]
            }
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u32",
                13
              ]
            }
          }
        ]
      }
    },
    {
      "name": "PoolStatusBitIndex",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "OpenPositionOrIncreaseLiquidity"
          },
          {
            "name": "DecreaseLiquidity"
          },
          {
            "name": "CollectFee"
          },
          {
            "name": "CollectReward"
          },
          {
            "name": "Swap"
          }
        ]
      }
    },
    {
      "name": "PoolStatusBitFlag",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Enable"
          },
          {
            "name": "Disable"
          }
        ]
      }
    },
    {
      "name": "RewardState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Uninitialized"
          },
          {
            "name": "Initialized"
          },
          {
            "name": "Opening"
          },
          {
            "name": "Ended"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "CreateConfigEvent",
      "fields": [
        {
          "name": "index",
          "type": "u16",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "protocolFeeRate",
          "type": "u32",
          "index": false
        },
        {
          "name": "tradeFeeRate",
          "type": "u32",
          "index": false
        },
        {
          "name": "tickSpacing",
          "type": "u16",
          "index": false
        },
        {
          "name": "fundFeeRate",
          "type": "u32",
          "index": false
        },
        {
          "name": "fundOwner",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "UpdaterConfigEvent",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "protocolFeeRate",
          "type": "u32",
          "index": false
        },
        {
          "name": "tradeFeeRate",
          "type": "u32",
          "index": false
        },
        {
          "name": "fundFeeRate",
          "type": "u32",
          "index": false
        },
        {
          "name": "fundOwner",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "CreatePersonalPositionEvent",
      "fields": [
        {
          "name": "poolState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "minter",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "nftOwner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tickLowerIndex",
          "type": "i32",
          "index": false
        },
        {
          "name": "tickUpperIndex",
          "type": "i32",
          "index": false
        },
        {
          "name": "liquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "depositAmount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "depositAmount1",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "IncreaseLiquidityEvent",
      "fields": [
        {
          "name": "positionNftMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "liquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "amount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount1",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "DecreaseLiquidityEvent",
      "fields": [
        {
          "name": "positionNftMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "liquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "decreaseAmount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "decreaseAmount1",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount1",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardAmounts",
          "type": {
            "array": [
              "u64",
              3
            ]
          },
          "index": false
        }
      ]
    },
    {
      "name": "CollectPersonalFeeEvent",
      "fields": [
        {
          "name": "positionNftMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "recipientTokenAccount0",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "recipientTokenAccount1",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount1",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateRewardInfosEvent",
      "fields": [
        {
          "name": "rewardGrowthGlobalX64",
          "type": {
            "array": [
              "u128",
              3
            ]
          },
          "index": false
        }
      ]
    },
    {
      "name": "PoolCreatedEvent",
      "fields": [
        {
          "name": "tokenMint0",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenMint1",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tickSpacing",
          "type": "u16",
          "index": false
        },
        {
          "name": "poolState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "sqrtPriceX64",
          "type": "u128",
          "index": false
        },
        {
          "name": "tick",
          "type": "i32",
          "index": false
        },
        {
          "name": "tokenVault0",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenVault1",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "CollectProtocolFeeEvent",
      "fields": [
        {
          "name": "poolState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "recipientTokenAccount0",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "recipientTokenAccount1",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount1",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "SwapEvent",
      "fields": [
        {
          "name": "poolState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "sender",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenAccount0",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenAccount1",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount1",
          "type": "u64",
          "index": false
        },
        {
          "name": "zeroForOne",
          "type": "bool",
          "index": false
        },
        {
          "name": "sqrtPriceX64",
          "type": "u128",
          "index": false
        },
        {
          "name": "liquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "tick",
          "type": "i32",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "LOK",
      "msg": "LOK"
    },
    {
      "code": 6001,
      "name": "NotApproved",
      "msg": "Not approved"
    },
    {
      "code": 6002,
      "name": "InvalidUpdateConfigFlag",
      "msg": "invalid update amm config flag"
    },
    {
      "code": 6003,
      "name": "AccountLack",
      "msg": "Account lack"
    },
    {
      "code": 6004,
      "name": "ClosePositionErr",
      "msg": "Remove liquitity, collect fees owed and reward then you can close position account"
    },
    {
      "code": 6005,
      "name": "ZeroMintAmount",
      "msg": "Minting amount should be greater than 0"
    },
    {
      "code": 6006,
      "name": "InvaildTickIndex",
      "msg": "Tick index of lower must be smaller than upper"
    },
    {
      "code": 6007,
      "name": "TickInvaildOrder",
      "msg": "The lower tick must be below the upper tick"
    },
    {
      "code": 6008,
      "name": "TickLowerOverflow",
      "msg": "The tick must be greater, or equal to the minimum tick(-221818)"
    },
    {
      "code": 6009,
      "name": "TickUpperOverflow",
      "msg": "The tick must be lesser than, or equal to the maximum tick(221818)"
    },
    {
      "code": 6010,
      "name": "TickAndSpacingNotMatch",
      "msg": "tick % tick_spacing must be zero"
    },
    {
      "code": 6011,
      "name": "InvalidTickArray",
      "msg": "Invaild tick array account"
    },
    {
      "code": 6012,
      "name": "SqrtPriceLimitOverflow",
      "msg": "Square root price limit overflow"
    },
    {
      "code": 6013,
      "name": "SqrtPriceX64",
      "msg": "sqrt_price_x64 out of range"
    },
    {
      "code": 6014,
      "name": "LiquiditySubValueErr",
      "msg": "Liquidity sub delta L must be smaller than before"
    },
    {
      "code": 6015,
      "name": "LiquidityAddValueErr",
      "msg": "Liquidity add delta L must be greater, or equal to before"
    },
    {
      "code": 6016,
      "name": "InvaildLiquidity",
      "msg": "Invaild liquidity when update position"
    },
    {
      "code": 6017,
      "name": "ForbidBothZeroForSupplyLiquidity",
      "msg": "Both token amount must not be zero while supply liquidity"
    },
    {
      "code": 6018,
      "name": "TransactionTooOld",
      "msg": "Transaction too old"
    },
    {
      "code": 6019,
      "name": "PriceSlippageCheck",
      "msg": "Price slippage check"
    },
    {
      "code": 6020,
      "name": "TooLittleOutputReceived",
      "msg": "Too little output received"
    },
    {
      "code": 6021,
      "name": "TooMuchInputPaid",
      "msg": "Too much input paid"
    },
    {
      "code": 6022,
      "name": "InvaildSwapAmountSpecified",
      "msg": "Swap special amount can not be zero"
    },
    {
      "code": 6023,
      "name": "InvalidInputPoolVault",
      "msg": "Input pool vault is invalid"
    },
    {
      "code": 6024,
      "name": "TooSmallInputOrOutputAmount",
      "msg": "Swap input or output amount is too small"
    },
    {
      "code": 6025,
      "name": "InvalidRewardIndex",
      "msg": "Invalid reward index"
    },
    {
      "code": 6026,
      "name": "FullRewardInfo",
      "msg": "The init reward token reach to the max"
    },
    {
      "code": 6027,
      "name": "RewardTokenAlreadyInUse",
      "msg": "The init reward token already in use"
    },
    {
      "code": 6028,
      "name": "ExceptPoolVaultMint",
      "msg": "The reward tokens must contain one of pool vault mint except the last reward"
    },
    {
      "code": 6029,
      "name": "InvalidRewardInitParam",
      "msg": "Invalid reward init param"
    },
    {
      "code": 6030,
      "name": "InvalidRewardDesiredAmount",
      "msg": "Invalid collect reward desired amount"
    },
    {
      "code": 6031,
      "name": "InvalidRewardInputAccountNumber",
      "msg": "Invalid collect reward input account number"
    },
    {
      "code": 6032,
      "name": "InvalidRewardPeriod",
      "msg": "Invalid reward period"
    },
    {
      "code": 6033,
      "name": "NotApproveUpdateRewardEmissiones",
      "msg": "Modification of emissiones is allowed within 72 hours from the end of the previous cycle"
    },
    {
      "code": 6034,
      "name": "UnInitializedRewardInfo",
      "msg": "uninitialized reward info"
    }
  ]
};
