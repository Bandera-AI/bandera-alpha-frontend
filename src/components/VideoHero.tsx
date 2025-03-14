
import { motion } from "framer-motion";

const VideoHero = () => {
  return (
    <motion.div
      className="w-full h-full rounded-xl overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
    >
      <div className="relative aspect-video w-full h-full">
        <img
          src="/bandera-uploads/product.png"
          alt="Bandera AI Dashboard"
          className="w-2/3 h-2/3 object-contain bg-[inherit] p-2 absolute right-0 bottom-0"
        />
        <img
          src="/bandera-uploads/product1.jpg"
          alt="Bandera AI Dashboard"
          className="w-2/3 h-2/3 object-contain bg-[inherit] p-2 absolute top-0 left-0"
        />
      </div>
    </motion.div>
  );
};

export default VideoHero;
