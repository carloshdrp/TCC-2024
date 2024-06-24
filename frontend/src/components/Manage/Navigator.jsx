import { Tabs } from "antd";
import Reports from "./Reports.jsx";
import ManageUsers from "./ManageUsers.jsx";

export const Navigator = () => {
  const tabs = [
    {
      key: "Denúncias",
      label: "Denúncias",
      type: "primary",
      children: <Reports />,
    },
    {
      key: "Usuários",
      label: "Usuários",
      children: <ManageUsers />,
    },
  ];

  return (
    <div className="p-2 bg-white rounded-[10px]">
      <div className="flex justify-between w-full mb-2">
        <p className="text-4xl font-bold text-text">Gerenciar</p>
      </div>
      <Tabs items={tabs} />
    </div>
  );
};
