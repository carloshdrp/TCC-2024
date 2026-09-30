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
