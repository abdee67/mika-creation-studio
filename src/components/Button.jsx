import clsx from "clsx";

const Button = ({
  id,
  title,
  rightIcon,
  leftIcon,
  containerClass,
  href,
  onClick,
  ...props
}) => {
  const className = clsx(
    "group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full bg-violet-50 px-5 py-2.5 text-black sm:px-7 sm:py-3",
    containerClass
  );

  const content = (
    <>
      {leftIcon}

      <span className="relative inline-flex overflow-hidden font-general text-[10px] uppercase sm:text-xs">
        <span className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
          {title}
        </span>
        <span className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
          {title}
        </span>
      </span>

      {rightIcon}
    </>
  );

  if (href) {
    return (
      <a id={id} href={href} onClick={onClick} className={className} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      id={id}
      onClick={onClick}
      className={className}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
