import React, {useState} from 'react'
const Calculator = () => {
    
    const digit = {
        0: '',
        1: '\u1369',
        2: '\u136A',
        3: '\u136B',
        4: '\u136C',
        5: '\u136D',
        6: '\u136E',
        7: '\u136F',
        8: '\u1370',
        9: '\u1371',
        10: '\u1372',
        20: '\u1373',
        30: '\u1374',
        40: '\u1375',
        50: '\u1376',
        60: '\u1377',
        70: '\u1378',
        80: '\u1379',
        90: '\u137A',
        100: '\u137B',
        10000: '\u137C'
    }
    const translator = (number) => {
        let geeznumber = ''
        let tmp = number;
        let digits = 0;
        while (tmp > 0) {
            digits++;
            tmp = Math.floor(tmp / 10);
        }
        if (digits <= 4) {
            geeznumber = translator_lessdigit(number);
        } else if (digits > 4) {
            geeznumber = translator_moredigits(number);
        }
        
        return geeznumber;
    }
    const translate = (number) => {
        number = parseInt(number)
        const sign = number < 0;
        number = Math.abs(number);
        let geeznumber = '';
        if (Number.isInteger(number)) {
            geeznumber = translator(number)
        }
        else {
            let decimal = number.toString();
            decimal = decimal.split('.');
            geeznumber = translator_decimal(parseInt(decimal[1])) + geeznumber;
            const afterdecimal = parseInt(decimal[0]);
            if (afterdecimal === 0) {
                geeznumber = `${'\u12D0' + '.'}${geeznumber}`;
            } else {
                geeznumber = `${translator(afterdecimal)}.${geeznumber}`;
            }
        }
        
        
        if (sign) {
            geeznumber = `-${geeznumber}`;
        }
        
        return geeznumber;
    }
    
    
    const translator_decimal = (number) => {
        let geeznumber = '';
        let tmp = 0;
        while (number > 0) {
            tmp = number % 10;
            geeznumber = digit[tmp] + geeznumber;
            number = Math.floor(number / 10);
        }
        
        return geeznumber;
    }
    
    const translator_lessdigit = (number) => {
        let geeznumber = '';
        let i = 0;
        let tmp = 0;
        while (number > 0) {
            tmp = number % 10;
            if (i === 2) {
                i = 0;
                geeznumber = digit[100] + geeznumber;
                while (number > 0) {
                    tmp = number % 10;
                    geeznumber = digit[tmp * (10 ** i)] + geeznumber;
                    number = Math.floor(number / 10);
                    i++;
                }
                break;
            } else {
                geeznumber = digit[tmp * (10 ** i)] + geeznumber;
            }
            number = Math.floor(number / 10);
            i += 1;
        }
        geeznumber = digit[number] + geeznumber;
        return geeznumber;
    }
    
    const translator_moredigits = (number) => {
        let geeznumber = '';
        geeznumber = translator_lessdigit(number % 10000) + geeznumber;
        number = number = Math.floor(number / 10000);
        geeznumber = translator(number) + digit[10000] + geeznumber;
        return geeznumber;
    }

    // state
    const [result, setResult] = useState("")
    const [calc, setCalc] = useState("")
    const [oprands, setOprands] = useState('')
    const ops = ['/', '*', '+', '-', '.'];
   
    const updateCalc = value => {
        if (
            ops.includes(value) && calc == "" ||
            ops.includes(value) && ops.includes(calc.slice(-1))
        ) {
            return;
        }
        setCalc(calc + value)

        if(!ops.includes(value)) {
            const valAsString = eval(calc + value).toString()
            setResult(translate(parseFloat(valAsString)));
        }
    }

    const calculate = () => {
        const evaluatedStr = eval(calc).toString()
        setCalc(translate(parseFloat(evaluatedStr)));
    }

    const resetCalc = () => {
        setCalc('')
    }
    const createBtn = () => {
        const digits = []
        for(let i = 1; i < 10; i++){
            digits.push(<button onClick={() => updateCalc(i)} value={i.toString()} key={i}>{translate(i)}</button>)
        }
        return digits;
    }
    return (
        <div className="calculator">
            <div className="display">
                <p>{calc || "0"}</p>
            </div>
            <div className="keybard-container">
                <div className="operands">
                    {createBtn()}
                    <button onClick={() => updateCalc('0')}>0</button>
                    <button onClick={() => updateCalc('.')}>.</button>
                    <button onClick={calculate}>=</button>
                </div>
            <div className="operators">
                <button onClick={resetCalc}>C</button>
                <button onClick={() => updateCalc('/')}>/</button>
                <button onClick={() => updateCalc('*')}>*</button>
                <button onClick={() => updateCalc('-')}>-</button>
                <button onClick={() => updateCalc('+')}>+</button>
                
            </div>
            </div>
        </div>
    )
}

export default Calculator