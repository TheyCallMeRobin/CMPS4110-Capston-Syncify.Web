import { OptionDto } from '../../api/generated/index.defs.ts';
import React, { CSSProperties, useId, useState } from 'react';

import './select.css';

type DataItem = OptionDto | string | number;

type SelectProps = Omit<Partial<HTMLSelectElement>, 'style'> & {
  onSelect?: {
    (value: string): Promise<any> | any;
    (value: number): Promise<any> | any;
    (value: string | number): Promise<any> | any;
  };
  style?: CSSProperties | (CSSStyleDeclaration & CSSProperties);
  data: DataItem[] | undefined;
  defaultValue?: string | number;
};

type OptionItemsProps = {
  items?: DataItem[];
  selectedItem?: string | number;
};

type OptionProps = {
  value: string | number;
  label: string | number;
};

const itemIsStringOrNumber = (item: DataItem) =>
  typeof item === 'string' || typeof item === 'number';

const Option: React.FC<OptionProps> = ({ value, label }) => {
  const id = useId();
  return (
    <option value={value} key={id}>
      {label}
    </option>
  );
};

const OptionItems: React.FC<OptionItemsProps> = ({ items }) => {
  return items?.map((item) => {
    if (itemIsStringOrNumber(item)) {
      return <Option value={item} label={item} key={item} />;
    }
    return (
      <Option
        value={item.value}
        label={item.label}
        key={`${item.value}-${item.label}`}
      />
    );
  });
};

export const Select: React.FC<SelectProps> = (props) => {
  const { className, data, onSelect, style, defaultValue } = props;

  const [selectedItem, setSelectedItem] = useState<string | number | undefined>(
    defaultValue
  );

  const _onSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;
    const parsedValue = isNaN(Number(value)) ? value : Number(value);

    setSelectedItem(selectedItem);

    if (onSelect) onSelect(parsedValue);
  };

  const classNames = className
    ? `select-component ${className}`
    : 'select-component';

  return (
    <select
      className={classNames}
      style={style}
      onSelect={_onSelect}
      defaultValue={defaultValue}
    >
      <OptionItems items={data} selectedItem={selectedItem} />
    </select>
  );
};
