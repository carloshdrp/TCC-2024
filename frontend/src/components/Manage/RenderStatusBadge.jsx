import { CircleCheckBig, CircleX, Hourglass } from "lucide-react";

const renderStatusBadge = (status) => {
  const statusText = {
    PENDING: "Pendente",
    ACCEPTED: "Aceita",
    REJECTED: "Rejeitada",
  }[status];

  const badgeClasses = {
    PENDING: "bg-yellow-200 text-yellow-800",
    ACCEPTED: "bg-green-200 text-green-800",
    REJECTED: "bg-red-200 text-red-800",
  };

  const badgeIcons = {
    PENDING: <Hourglass className="w-4 h-4 mr-1" />,
    ACCEPTED: <CircleCheckBig className="w-4 h-4 mr-1" />,
    REJECTED: <CircleX className="w-4 h-4 mr-1" />,
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badgeClasses[status]}`}
    >
      {badgeIcons[status]}
      {statusText}
    </span>
  );
};

export default renderStatusBadge;
