import './result.css'
import * as React from 'react';
import {Grid, TextField, Button} from '@mui/material';

const _1K_TOKENS_IN_LED_LIGHTS_MIN = 75
const _1K_TOKENS_IN_65LED_TV_MIN = 16.8
const _1K_TOKENS_IN_AIRCON_MIN = 1.0
const _1K_TOKENS_IN_CHARING_SAMSUNG_NOTES10PLUS_PERCENTAGE = 157.9

function CalcResult({numTokens}) {

    const inLedLights = (numTokens * _1K_TOKENS_IN_LED_LIGHTS_MIN / 1000).toFixed(2);
    const inLedTv = (numTokens * _1K_TOKENS_IN_65LED_TV_MIN / 1000).toFixed(2);
    const inAircon = (numTokens * _1K_TOKENS_IN_AIRCON_MIN / 1000).toFixed(2);
    const inChargingPhone = (numTokens * _1K_TOKENS_IN_CHARING_SAMSUNG_NOTES10PLUS_PERCENTAGE / 1000).toFixed(2);

    return (
        <div className="result-container">
            <div>Your Request is Calculated.</div>
            <div>
                If you ask Your Question to ChatGPT, that need {numTokens} tokens Data Analysis for Generating Answer.
                <ul>
                    <li>It costs {inLedLights} minutes of LED Lights.</li>
                    <li>It costs {inLedTv} minutes of 65” LED TV.</li>
                    <li>It costs {inAircon} minutes of Air Conditioner.</li>
                    <li>It costs {inChargingPhone} percentage of Charging Samsung Galaxy Note 10 Plus.</li>
                </ul>
                It costs “00000 wh” and “000 CO2 emission”. And Someone can you that Energy for More Mandatory Daily Life Activities.
            </div>
            <div>
                Still you want to proceed at ChatGPT?
                Or want to get Alternative Action Items?
            </div>
        </div>
    )

}

export default CalcResult;