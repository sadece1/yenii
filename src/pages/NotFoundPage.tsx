import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/Button';
import { routes } from '@/config';

export const NotFoundPage = () => {
  return (
    <>
      <SEO 
        title="404 - Sayfa Bulunamadı"
        description="Aradığınız sayfa bulunamadı."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 404 Number */}
            <motion.div
              className="text-[180px] md:text-[240px] font-black text-primary-600 dark:text-primary-400 leading-none"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              404
            </motion.div>

            {/* Emoji Animation */}
            <motion.div
              className="text-6xl mb-6"
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              🏕️❓
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Kaybolmuş Gibisiniz!
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Aradığınız sayfa kamp alanında kaybolmuş olabilir. Harita ile ana sayfaya dönelim!
            </motion.p>

            {/* Actions */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link to={routes.home}>
                <Button variant="primary" size="lg" className="min-w-[200px]">
                  🏠 Ana Sayfaya Dön
                </Button>
              </Link>
              <Link to={routes.contact}>
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  📧 İletişime Geç
                </Button>
              </Link>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              className="mt-12 flex justify-center gap-8 text-4xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.5 }}
            >
              <motion.span
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⛺
              </motion.span>
              <motion.span
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              >
                🌲
              </motion.span>
              <motion.span
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              >
                🔥
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};



