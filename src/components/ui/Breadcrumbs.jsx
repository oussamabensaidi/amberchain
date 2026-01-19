import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Breadcrumbs({ items = [] }) {
  const navigate = useNavigate();

  const handleNavigate = (href, e) => {
    e.preventDefault();
    if (href && href !== "#") {
      navigate(href);
    }
  };

  return (
    <nav className="flex items-center gap-2 py-2 px-4 bg-muted/30 rounded-lg border border-border/50 w-fit">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <button
            onClick={(e) => handleNavigate(item.href, e)}
            disabled={item.active}
            className={`text-sm transition-colors ${
              item.active
                ? "font-semibold text-foreground cursor-default"
                : "text-muted-foreground hover:text-foreground cursor-pointer"
            }`}
          >
            {item.label}
          </button>
          {index < items.length - 1 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      ))}
    </nav>
  );
}
