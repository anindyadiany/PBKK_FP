const Footer = () => {
  return (
    <footer className="bg-[#69995D] text-white pt-12 pb-6 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* logo */}
          <div className="col-span-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="31"
              height="31"
              viewBox="0 0 31 31"
              fill="none"
              className="mb-4"
            >
              <path
                d="M11.0674 2.04425C9.95005 3.33125 9.5143 4.95247 9.70132 6.74565C8.82008 7.30151 8.27881 8.20728 8.09549 9.13675C7.87753 10.2358 8.06648 11.3906 8.49875 12.4342C9.32694 14.4336 8.95952 15.5211 8.52792 17.0106C8.09632 18.5001 7.60053 20.3916 8.62596 22.8672C9.46009 24.8809 10.9479 26.2045 12.7099 26.712C14.4717 27.2237 16.4425 26.9694 18.3811 26.1664C20.3197 25.3634 21.8931 24.1497 22.7788 22.5413C23.6641 20.9373 23.781 18.9511 22.9461 16.9356C21.9207 14.46 20.2326 13.4731 18.8742 12.7251C17.5158 11.977 16.487 11.4678 15.6588 9.46839C15.2265 8.42481 14.5443 7.47639 13.6123 6.8516C13.0046 6.44227 12.2899 6.22052 11.5572 6.21389C11.512 5.68996 11.5749 5.16232 11.7421 4.66375C11.9094 4.16517 12.1773 3.70629 12.5293 3.31563C12.6956 3.12145 12.7784 2.86942 12.7596 2.61447C12.7409 2.35952 12.6221 2.12232 12.4292 1.95456C12.2363 1.78681 11.9849 1.7021 11.7298 1.7189C11.4747 1.7357 11.2366 1.85265 11.0674 2.04425Z"
                fill="#F9F9F9"
              />
            </svg>
          </div>

          {/* Navigation bla bla bla */}
          <div>
            <h3 className="font-bold text-lg mb-4">Home</h3>
            <span className="block text-white/80">-</span>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Series</h3>
            <span className="block text-white/80">-</span>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Store</h3>
            <span className="block text-white/80">-</span>
          </div>

          {/* Info and buttons */}
          <div className="flex flex-col gap-2">
            <h3 className="font-bold mb-1">FAQS</h3>
            <h3 className="font-bold mb-1">About us</h3>
            <h3 className="font-bold mb-4">Contact us</h3>
          </div>
        </div>

        {/* the lines */}
        <div className="border-t border-dashed border-white/50 my-8" />

        {/* bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white/90">
          <div className="flex gap-6 mb-4 md:mb-0">
            <a href="#" className="hover:underline">
              Legal Terms
            </a>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
          </div>

          <div className="flex gap-6 items-center">
            <span className="font-bold">Connect:</span>
            <a href="#" className="hover:underline">
              Instagram
            </a>
            <a href="#" className="hover:underline">
              Facebook
            </a>
            <a href="#" className="hover:underline">
              Youtube
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
