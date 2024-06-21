import { Tabs } from "antd";

export const Navigator = () => {
  const tabs = [
    {
      key: "Denúncias",
      label: "Denúncias",
      type: "primary",
    },
    {
      key: "Perguntas",
      label: "Perguntas",
    },
    {
      key: "Respostas",
      label: "Respostas",
    },
    {
      key: "Questionários",
      label: "Questionários",
    },
    {
      key: "Usuários",
      label: "Usuários",
    },
  ];

  return (
    <div className="p-2 bg-white rounded-[10px]">
      <div className="flex justify-between w-full mb-[10px]">
        <p className="text-4xl font-bold text-text">Gerenciar</p>
      </div>
      <Tabs items={tabs} />
    </div>
  );
};
