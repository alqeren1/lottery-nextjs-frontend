import { useWeb3Contract } from "react-moralis"
//import { abi, contractAddresses } from "../constants/"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification, Icon } from "web3uikit"
import { Bell } from "@web3uikit/icons"

const abi = require("../constants/abi.json") // Adjust the path to your ABI file
const contractAddresses = require("../constants/contractAddresses.json")

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()

    console.log(parseInt(chainIdHex))
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const dispatch = useNotification()
    //değerin durmadan renderlanması için useState variable olmalı aşağıdaki gibi

    //     variable       function             starting value
    const [entranceFee, setEntranceFee] = useState("0")

    const { runContractFunction: enterRaffle } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    useEffect(() => {
        if (isWeb3Enabled) {
            async function updateUI() {
                const entranceFeeFromCall = (await getEntranceFee()).toString()
                setEntranceFee(entranceFeeFromCall)
                console.log(entranceFeeFromCall)
            }
            updateUI()
        }
    }, [isWeb3Enabled])

    const handlesuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction is complete",
            title: "Tx Notification",
            position: "topR",
            icon: <Bell />,
        })
    }

    return (
        <div>
            Hi from lottery entrance!
            {raffleAddress ? (
                <div>
                    Entrance fee: {ethers.utils.formatUnits(entranceFee, "ether")}
                    <div></div>
                    <button
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handlesuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                    >
                        Enter Raffle
                    </button>
                </div>
            ) : (
                <div>No Raffle address found </div>
            )}
        </div>
    )
}
