import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";

type filter = {
  name: string;
  value: string;
};

interface FilterProps {
  placeholder?: string;
  filters: filter[];
  otherClasses?: string;
  containerClasses?: string;
}

const Filter = ({
  placeholder,
  filters,
  otherClasses,
  containerClasses,
}: FilterProps) => {
  return (
    <div className={`relative ${containerClasses}`}>
      <Select>
        <SelectTrigger
          className={`${otherClasses} light-border body-regular background-light800_dark300 text-dark500_light700 border px-5 py-2.5 `}>
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filters.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
