# Setup banco de dados:
- ```npx prisma db push```
- ```npx prisma generate```
- ```npm run seed```

### Usuários:
- admin@email.com
- estudante@email.com
- usuario@email.com

**Senha padrão:** `senha123`

### String de conexão (.env)
DATABASE_URL="mysql://root:root@localhost:3306/genius
```
root:root == user:pass
genius == schema
```

# Iniciar o backend:
```cd backend``` > ```npm i``` > ```npm run dev```

Porta padrão: `8080`

# Iniciar o frontend:
 ```cd frontend``` > ```npm i``` > ```npm run dev```

Porta padrão: `5173`

# Ainda faltam:
- [X] Completar a página Recursos;
- [X] Notificação;
- [X] Completar seeds;
- [X] Ajustar conquista editar perfil para não alterar o updatedAt quando os pontos forem trocados;
- [X] Trocar ícones do antd pelo lucide

---
- [X] Quando o estado menuTab foi != de descobrir, utilizar ela como valor do select no formulário;
- [X] Melhorar as rules e a mensagem de erro no formulário de register;
- [X] Adicionar campo descrição a denúncia e exibir no lugar do ID na tabela;
- [X] Adicionar uma seção suas denúncias no perfil do usuário;
- [X] Mostrar se o administrador deletou ou não o recurso denunciado;
- [X] Ajustar as permissões;
- [X] Conquistas;
