import React from "react";

type HeaderProps = {
  name: string;
};

const Header = (props: HeaderProps) => {
  const { name } = props;

  return <h1 className="text-2xl font-semibold text-gray-700">{name}</h1>;
};

export default Header;
