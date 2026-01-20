interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export default function Card({ children, title, className = '' }: CardProps) {
  return (
    <div className={`bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto border border-gray-200 ${className}`}>
      {title && <h2 className="text-2xl font-bold mb-6 text-gray-900">{title}</h2>}
      {children}
    </div>
  );
}
