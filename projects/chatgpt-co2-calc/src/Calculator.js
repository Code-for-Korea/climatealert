import './calc.css';
import * as React from 'react';
import CalcResult from './CalcResult';
import {Grid, TextField, Button} from '@mui/material';

const DEFAULT_STATUS_STR = 'We are ready.';
const KOREAN_CHECK_PATTERN = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

function Calculator() {

    const [query, setQuery] = React.useState('');
    const [numTokens, setNumTokens] = React.useState(0);
    const [statusStr, setStatusStr] = React.useState(DEFAULT_STATUS_STR);

    function calcQueryToken(str) {
        setQuery(str);
        const words = str.split(' ').length;
        let tokens = 0;
        let engWords = 0;
        if (!! str) {
            for (const word of str.split(' ')) {
                if (KOREAN_CHECK_PATTERN.test(word)) {
                    tokens += word.length; // in korea, 1 char = about 1 token
                } else {
                    engWords++;
                }
            }
            // in english, 75 words = 100 tokens
            tokens += Math.ceil(4 * engWords / 3);
            setStatusStr(`You’re typed.\n${words} words\n= about ${tokens} tokens`);
        } else {
            setStatusStr(DEFAULT_STATUS_STR);
        }
        setNumTokens(tokens);
    }

    return (
    <div className='calc-container'>
        <div className="step1-header">
            <div>👉 STEP1. Please input your Question.</div>
            <div className='ex'>Ex: Where will FtO24 be held next year?</div>
        </div>
        <Grid container spacing={2}>
            <Grid item xs>
                <TextField fullWidth multiline rows={5}
                    value={query}
                    onChange={(event) => {calcQueryToken(event.target.value);}}
                />
            </Grid>
            <Grid item style={{width: "180px"}}>
                <div className='step1-side'>
                    <div className='status'>
                        <div>{statusStr}</div>
                    </div>
                    <Button disabled={! query} variant="contained"
                        className='btn-submit'>SUBMIT</Button>
                </div>
            </Grid>
        </Grid>
        <div className="step-divider" />
        <div className="step2-header">
            <div>👉 STEP2. Check the Electronic Consumption and Carbon Footprint.</div>
        </div>
        {!!numTokens && <CalcResult numTokens={numTokens} />}
    </div>
    )
}

export default Calculator;