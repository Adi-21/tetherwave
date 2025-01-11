import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div
        className={`container px-4 lg:px-16 flex justify-center items-center w-full h-full ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Container;
