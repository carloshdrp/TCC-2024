import {
  Avatar,
  Button,
  Drawer,
  Input,
  Modal,
  notification,
  Space,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import {
  useGetUserQuery,
  useRemoveUserMutation,
} from "../../api/slices/profileApiSlice";
import { Search as SearchIcon, TrashIcon, UserRound } from "lucide-react";
import { API_AVATAR } from "../../config/index.js";
import { useDeleteAvatarMutation } from "../../api/slices/avatarApiSlice.js";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const { confirm } = Modal;

const ManageUsers = () => {
  const { data: users, isLoading, refetch } = useGetUserQuery();
  const [removeUser] = useRemoveUserMutation();
  const [deleteAvatar] = useDeleteAvatarMutation();

  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [sortedInfo, setSortedInfo] = useState({});

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setVisibleDrawer(true);
  };

  const handleDeleteUser = async (userId, avatar) => {
    try {
      if (avatar) {
        await deleteAvatar(avatar);
      }
      await removeUser(userId);
      notification.success({
        message: "Usuário deletado com sucesso!",
        description: "Todo conteúdo associado ao usuário foi removido.",
      });
      refetch();
      setVisibleDrawer(false);
    } catch (e) {
      notification.error({
        message: "Erro ao deletar usuário!",
      });
    }
  };

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Pesquisar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm)}
            icon={<SearchIcon size={16} />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Limpar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchIcon
        size={16}
        style={{ color: filtered ? "#1890ff" : undefined }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  });

  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Cargo",
      dataIndex: "role",
      key: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
      sortOrder: sortedInfo.columnKey === "role" && sortedInfo.order,
    },
    {
      title: "Registrado há",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => {
        const dateCreate = new Date(createdAt);
        return formatDistanceToNow(dateCreate, {
          locale: ptBR,
        });
      },
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      sortOrder: sortedInfo.columnKey === "createdAt" && sortedInfo.order,
    },
    {
      title: "Ação",
      key: "actions",
      render: (_, user) => (
        <>
          <Button
            className="flex items-center justify-center gap-2"
            onClick={() => handleViewUser(user)}
          >
            <UserRound />
            Visualizar
          </Button>
        </>
      ),
    },
  ];

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const showConfirm = () => {
    confirm({
      title: "Essa ação é irreversível, você tem certeza?",
      icon: <ExclamationCircleFilled />,
      content:
        "Uma vez que deletar os dados do usuário, não poderá recuperá-los. Todo o conteúdo relacionado ao usuário será removido.",
      okText: "Deletar",
      okType: "danger",
      cancelText: "Cancelar",

      onOk: () => handleDeleteUser(selectedUser.id, selectedUser.avatar),
    });
  };

  return (
    <>
      <Table
        dataSource={users}
        loading={isLoading}
        columns={columns}
        onChange={handleChange}
      />
      <Drawer
        title="Detalhes do Usuário"
        placement="right"
        size="large"
        onClose={() => setVisibleDrawer(false)}
        open={visibleDrawer}
      >
        {selectedUser && (
          <div>
            <Avatar
              shape="circle"
              size={64}
              src={
                selectedUser.avatar
                  ? API_AVATAR + selectedUser.avatar
                  : undefined
              }
              icon={
                selectedUser.avatar ? undefined : (
                  <UserRound size={64} strokeWidth={1.5} />
                )
              }
            />
            <h2>{selectedUser.name}</h2>
            <p>Email: {selectedUser.email}</p>
            <p>Função: {selectedUser.role}</p>
            <p>
              Conta criada em:{" "}
              {format(parseISO(selectedUser.createdAt), "dd/MM/yyyy - HH:mm")}
            </p>
            <p>
              Conta atualizada em:{" "}
              {format(parseISO(selectedUser.updatedAt), "dd/MM/yyyy - HH:mm")}
            </p>
            <div className="flex flex-col gap-2 mt-10">
              <Button
                type="primary"
                danger
                className="flex items-center justify-center gap-2"
                onClick={showConfirm}
              >
                <TrashIcon />
                Deletar usuário
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default ManageUsers;
