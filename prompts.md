# Prompt - API de Controle de Gastos Pessoais

## Objetivo
Criar uma API REST para controle de gastos pessoais.

## Contexto
A API possui as seguintes funcionalidades:
- Registro de usuário
- Login de usuário
- Cadastro de despesa
- Listagem de despesas do usuário (com filtro opcional por categoria e por mês)
- Consulta de despesa por id
- Exclusão de despesa
- Resumo mensal de gastos, somando o total por categoria

Para que eu possa usar as funcionalidades, preciso fazer login.

Cada despesa possui: valor, categoria, data e descrição.

As categorias possíveis são: alimentação, transporte, moradia, saúde, lazer, educação, outros.

Cada usuário só pode ver, editar e excluir as próprias despesas, nunca as de outro usuário.

O valor de uma despesa deve ser sempre positivo, maior que zero.

## Regras
Apenas execute o que eu pedir, não me pergunte nada.

Divida a API em camadas: routes, controllers, service e model.

Armazene os dados da API em um banco de dados em memória.

Utilize a biblioteca Express para construir a API REST.

Passe com que a autenticação seja parte do middleware, utilizando token JWT como modelo de autenticação.

Implemente as regras de autenticação e autorização seguindo as informações descritas no contexto.

A documentação da API deve ser feita com Swagger, em forma de arquivo. Crie esse arquivo em uma pasta de recursos. O Swagger precisa descrever o modelo JSON da resposta de cada endpoint, com base na forma que a API for implementada. O Swagger também deve contemplar os status code de erro que são implementados na API.

Adicione um endpoint para renderizar o Swagger.

Construa um arquivo README para descrever o projeto.
