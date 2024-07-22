import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Badge,
  Button,
  Dropdown,
  Empty,
  Pagination,
  Space,
  Tooltip,
  Typography,
} from "antd";
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "../../api/slices/notificationApiSlice.js";
import {
  disconnectNotificationSocket,
  initNotificationSocket,
} from "../../config/socket.js";
import { selectCurrentUser } from "../../redux/slices/authSlice.js";
import { Bell, CheckCheck, ExternalLink, Eye } from "lucide-react";
import { addNotification } from "../../redux/slices/notificationSlice.js";
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

function Notifications() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userState = useSelector(selectCurrentUser);
  const { data: notifications = [], refetch } = useGetNotificationsQuery();
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
  const [markAllNotificationsAsRead] = useMarkAllNotificationsAsReadMutation();

  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pageSize = 5;

  useEffect(() => {
    let socket;
    const initSocket = async () => {
      if (userState.id) {
        socket = initNotificationSocket(userState.id);
        try {
          socket.on("newNotification", (notification) => {
            dispatch(addNotification(notification));
            refetch();
          });
        } catch (error) {
          console.error("Erro ao autenticar socket:", error);
        }
      }
    };

    initSocket();

    return () => {
      if (socket) {
        socket.off("newNotification");
        disconnectNotificationSocket();
      }
    };
  }, [userState.id, refetch, dispatch]);

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.readAt).length);
  }, [notifications]);

  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await markNotificationAsRead(notificationId);
      refetch();
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      refetch();
    } catch (error) {
      console.error("Erro ao marcar todas as notificações como lidas:", error);
    }
  };

  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const menuItems = useMemo(() => {
    return paginatedNotifications.map((notification) => ({
      key: notification.id,
      label: (
        <div className="px-[10px] py-2 mb-[10px] rounded cursor-default">
          <Space direction="vertical" size="small" className="w-full">
            <Text strong={!notification.readAt} className="max-w-[80%]">
              {!notification.readAt && <Badge dot className="mr-2" />}{" "}
              {notification.content}
            </Text>
            {notification.resourceId && (
              <Button
                type="link"
                className="m-0"
                onClick={(e) => {
                  if (!notification.readAt) {
                    handleMarkAsRead(notification.id, e);
                  }

                  navigate(notification.resourceId);
                }}
              >
                Conferir <ExternalLink size="14" />
              </Button>
            )}
            <div className="flex justify-between items-center">
              <Text type="secondary" className="text-sm">
                {new Date(notification.createdAt).toLocaleString()}
              </Text>
              {!notification.readAt ? (
                <Button
                  icon={<Eye size="20" />}
                  className="items-center justify-center flex"
                  type="text"
                  onClick={(e) => handleMarkAsRead(notification.id, e)}
                />
              ) : (
                <Tooltip
                  title={
                    "Lido em:" + new Date(notification.readAt).toLocaleString()
                  }
                >
                  <CheckCheck size="16" color="#3F51B5" />
                </Tooltip>
              )}
            </div>
          </Space>
        </div>
      ),
    }));
  }, [paginatedNotifications, handleMarkAsRead]);

  const dropdownRender = (menu) => (
    <div className="bg-background rounded-[10px] shadow">
      {notifications.length > 0 ? (
        <>
          <div className="flex justify-between items-start px-4 py-2">
            <Title level={4} className="m-0">
              Notificações
            </Title>
            {unreadCount > 0 && (
              <Button type="link" onClick={handleMarkAllAsRead} className="p-0">
                Ler todas
              </Button>
            )}
          </div>
          {menu}
          <div className="py-4">
            <Pagination
              simple
              current={currentPage}
              total={notifications.length}
              pageSize={pageSize}
              onChange={handlePageChange}
              className="flex justify-center"
            />
          </div>
        </>
      ) : (
        <Empty description="Nenhuma notificação encontrada" className="py-4" />
      )}
    </div>
  );

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={["click"]}
      placement="bottomRight"
      overlayStyle={{
        width: "400px",
      }}
      dropdownRender={dropdownRender}
      open={isDropdownOpen}
      onOpenChange={setIsDropdownOpen}
    >
      <Badge count={unreadCount} overflowCount={99}>
        <Button
          icon={<Bell size="20" />}
          shape="circle"
          size="large"
          className="items-center justify-center flex"
        />
      </Badge>
    </Dropdown>
  );
}

export default Notifications;
