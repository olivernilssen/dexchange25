export default function Badge({ children, type = "default" }) {
    const colors = {
      default: "bg-[#b4bce3] text-[#081079]",
      workshop: "bg-[#edadac] text-[#081079]",
      speech: "bg-[#8da9e4] text-[#081079]",
      common: "bg-[#f6a495] text-[#081079]",
    };
    
    return (
      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[type] || colors.default}`}>
        {children}
      </span>
    );
  }