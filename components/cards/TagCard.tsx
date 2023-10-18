import Link from "next/link";
import React from "react";

const TagCard = () => {
  return (
    <Link
      href={`/tags/${_id}`}
      className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"></Link>
  );
};

export default TagCard;
