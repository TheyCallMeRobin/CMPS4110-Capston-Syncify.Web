import { OptionDto } from '../api/generated/index.defs.ts';
import React, { CSSProperties, useCallback, useId, useState } from 'react';

type DataItem = OptionDto | string | number;

type SelectProps = {
  onSelect?: (value: string | number) => void;
  style?: CSSProperties;
  data?: DataItem[];
  className?: string;
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

const OptionItems: React.FC<OptionItemsProps> = ({ items, selectedItem }) => {
  const filterItems = useCallback(
    (item: DataItem): boolean => {
      if (selectedItem) return true;

      if (itemIsStringOrNumber(item)) return item === selectedItem;

      return item.value === selectedItem;
    },
    [selectedItem]
  );

  return items?.filter(filterItems).map((item) => {
    if (itemIsStringOrNumber(item)) {
      return <Option value={item} label={item} />;
    }

    return <Option value={item.value} label={item.label} />;
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

  return (
    <select
      className={className}
      style={style}
      onSelect={_onSelect}
      defaultValue={defaultValue}
    >
      <OptionItems items={data} selectedItem={selectedItem} />
    </select>
  );
};
