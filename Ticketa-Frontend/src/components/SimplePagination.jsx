import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export function SimplePagination({ pagination, onPageChange }) {
  const currentPage = pagination.number;
  const totalPages = pagination.totalPages;

  return (
    <motion.div
      className="flex gap-3 items-center justify-center mt-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Previous Button */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="sm"
          className="cursor-pointer rounded-xl bg-gray-900 border border-gray-700 text-gray-300 hover:text-cyan-400 hover:border-cyan-500 transition-all"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={pagination.first}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Page Info */}
      <div className="text-sm font-medium text-gray-400">
        <span className="text-cyan-400">Page {currentPage + 1}</span> 
        <span className="text-gray-500"> of {totalPages}</span>
      </div>

      {/* Next Button */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="sm"
          className="cursor-pointer rounded-xl bg-gray-900 border border-gray-700 text-gray-300 hover:text-cyan-400 hover:border-cyan-500 transition-all"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={pagination.last}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
