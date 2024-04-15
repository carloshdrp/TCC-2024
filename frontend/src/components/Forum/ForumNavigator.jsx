import { Tabs, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedTab,
  setSearch,
  getSelectedTab,
} from "../../redux/slices/forumNavigatorSlice";
const { Search } = Input;

export const ForumNavigator = () => {
  const dispatch = useDispatch();
  const selectedTab = useSelector(getSelectedTab);

  const onSearch = (value) => dispatch(setSearch(value));

  const tabs = [
    {
      key: "Geral",
      label: "Geral",
    },
    {
      key: "Linguagens",
      label: "Linguagens",
    },
    {
      key: "Redação",
      label: "Redação",
    },
    {
      key: "Matemática",
      label: "Matemática",
    },
    {
      key: "Ciências Humanas",
      label: "Ciências Humanas",
    },
    {
      key: "Ciências da Natureza",
      label: "Ciências da Natureza",
    },
  ];

  return (
    <div className="p-2 bg-white rounded-[10px]">
      <div className="flex justify-between w-full mb-[10px]">
        <p className="text-4xl font-bold text-text">Fórum</p>
        <div className="flex items-center gap-2">
          <Search
            placeholder="Pesquisar pergunta"
            allowClear
            onSearch={onSearch}
            style={{
              width: 400,
            }}
          />
        </div>
      </div>
      <Tabs
        defaultActiveKey={selectedTab}
        items={tabs}
        onChange={(key) => dispatch(setSelectedTab(key))}
      />
    </div>
  );
};
