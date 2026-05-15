import Button from "./Button";

const ImageClipBox = ({ src, clipClass }) => (
  <div className={clipClass}>
    <img src={src} />
  </div>
);

const Contact = () => {
  return (
    <div id="contact" className="my-12 min-h-96 w-full px-4 sm:my-16 sm:px-6 lg:my-20 lg:px-10">
      <div className="relative overflow-hidden rounded-lg bg-black px-4 py-16 text-blue-50 sm:px-8 sm:py-24">
        <div className="absolute -left-20 top-0 hidden h-full w-72 overflow-hidden sm:block lg:left-20 lg:w-96">
          <ImageClipBox
            src="/img/contact-1.webp"
            clipClass="contact-clip-path-1"
          />
          <ImageClipBox
            src="/img/contact-2.webp"
            clipClass="contact-clip-path-2 lg:translate-y-40 translate-y-60"
          />
        </div>

        <div className="absolute -top-40 left-20 hidden w-60 sm:top-1/2 md:left-auto md:right-10 md:block lg:top-20 lg:w-80">
          <ImageClipBox
            src="/img/swordman-partial.webp"
            clipClass="absolute md:scale-125"
          />
          <ImageClipBox
            src="/img/swordman.webp"
            clipClass="sword-man-clip-path md:scale-125"
          />
        </div>

        <div className="flex flex-col items-center text-center">
          <p className="mb-8 font-general text-[10px] uppercase sm:mb-10">
            Start a project
          </p>

          <h2 className="special-font max-w-4xl font-zentry text-5xl font-black uppercase leading-[.9] sm:text-6xl md:text-[6.2rem]">
            Let&apos;s b<b>u</b>ild your <br />
            next visual <br />
            st<b>o</b>ry together.
          </h2>

          <Button title="contact us" containerClass="mt-10 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Contact;
