import React, { forwardRef, useState, useRef, useEffect, useCallback, useImperativeHandle } from 'react';
import classes from './index.module.less';
import { isEmpty } from '@/utils';

export type Rule = {
  message?: string;
  pattern?: RegExp;
  validator?: (value: string) => true | string;
};

type InputProps = {
  onChange?: (event: any) => void;
  prefixIcon: React.ReactElement;
  type?: 'text' | 'password';
  defaultValue?: string;
  placeholder?: string;
  rules: Array<Rule>;
  value?: string;
};

function Input(props: InputProps, ref: any) {
  const { prefixIcon, rules, placeholder, onChange, value, type, defaultValue } = props;
  const [inputValue, setInputValue] = useState(defaultValue || '');
  const [showTips, updateShowTips] = useState(false);
  const [tips, setTips] = useState('hellowoir');
  const warningTipsRef = useRef<any>();
  const inputRef = useRef<any>();
  useEffect(() => {
    setInputValue(() => value!);
  }, [value]);

  const validator = useCallback((value: string, rules: Array<Rule>) => {
    if (isEmpty(rules)) return;

    for (let i = 0; i < rules.length; i++) {
      const { message, pattern, validator } = rules[i];

      if (typeof validator === 'function') {
        const result = validator(value);
        if (result === true) {
          continue;
        } else {
          setTips(result);
          updateShowTips(() => true);
          return;
        }
      } else if (pattern) {
        if (pattern.test(value)) {
          continue;
        } else {
          setTips(message!);
          updateShowTips(() => true);
          return;
        }
      }
    }
    updateShowTips(() => false);
  }, []);

  const handleChange = useCallback(
    (event: any) => {
      onChange?.(event);
      const value = event.target.value;
      setInputValue(() => value);
      validator(value, rules);
    },
    [rules, onChange],
  );

  useImperativeHandle(
    ref,
    () => ({
      input: inputRef.current,
      validator: () => validator(inputRef.current.value, rules),
    }),
    [],
  );

  return (
    <div className={classes.form_item}>
      <p ref={warningTipsRef} className={`${classes.warning_tips}${showTips ? ' ' + classes.show : ''}`}>
        {tips}
      </p>
      {React.cloneElement(prefixIcon, { className: classes.input_prefix_icon })}
      <input
        type={type}
        ref={inputRef}
        value={inputValue}
        autoComplete="off"
        onChange={handleChange}
        placeholder={placeholder}
        className={`${classes.input}${type === 'password' ? ' ' + classes.passwd : ''}`}
      />
    </div>
  );
}

export default forwardRef(Input);
