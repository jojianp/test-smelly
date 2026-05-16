const { UserService } = require('../src/userService');

describe('UserService - Suíte de Testes Limpos', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  // ─── createUser ──────────────────────────────────────────────

  test('deve criar um usuário com os dados corretos', () => {
    // Arrange
    const nome = 'Fulano de Tal';
    const email = 'fulano@teste.com';
    const idade = 25;

    // Act
    const usuarioCriado = userService.createUser(nome, email, idade);

    // Assert
    expect(usuarioCriado.id).toBeDefined();
    expect(usuarioCriado.nome).toBe(nome);
    expect(usuarioCriado.email).toBe(email);
    expect(usuarioCriado.status).toBe('ativo');
  });

  test('deve lançar erro ao criar usuário menor de idade', () => {
    // Arrange
    const idade = 17;

    // Act & Assert
    expect(() =>
      userService.createUser('Menor', 'menor@email.com', idade)
    ).toThrow('O usuário deve ser maior de idade.');
  });

  test('deve lançar erro ao criar usuário sem nome', () => {
    // Act & Assert
    expect(() =>
      userService.createUser('', 'email@teste.com', 25)
    ).toThrow('Nome, email e idade são obrigatórios.');
  });

  // ─── getUserById ─────────────────────────────────────────────

  test('deve retornar o usuário correto ao buscar por ID', () => {
    // Arrange
    const usuarioCriado = userService.createUser('Fulano', 'fulano@teste.com', 25);

    // Act
    const usuarioBuscado = userService.getUserById(usuarioCriado.id);

    // Assert
    expect(usuarioBuscado.nome).toBe('Fulano');
    expect(usuarioBuscado.id).toBe(usuarioCriado.id);
  });

  test('deve retornar null ao buscar ID inexistente', () => {
    // Act
    const resultado = userService.getUserById('id-que-nao-existe');

    // Assert
    expect(resultado).toBeNull();
  });

  // ─── deactivateUser ──────────────────────────────────────────

  test('deve desativar um usuário comum com sucesso', () => {
    // Arrange
    const usuario = userService.createUser('Comum', 'comum@teste.com', 30);

    // Act
    const resultado = userService.deactivateUser(usuario.id);

    // Assert
    expect(resultado).toBe(true);
    expect(userService.getUserById(usuario.id).status).toBe('inativo');
  });

  test('não deve desativar um usuário administrador', () => {
    // Arrange
    const admin = userService.createUser('Admin', 'admin@teste.com', 40, true);

    // Act
    const resultado = userService.deactivateUser(admin.id);

    // Assert
    expect(resultado).toBe(false);
    expect(userService.getUserById(admin.id).status).toBe('ativo');
  });

  // ─── generateUserReport ──────────────────────────────────────

  test('deve retornar cabeçalho no relatório', () => {
    // Arrange
    userService.createUser('Alice', 'alice@email.com', 28);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('Relatório de Usuários');
  });

  test('deve incluir nome e status do usuário no relatório', () => {
    // Arrange
    userService.createUser('Alice', 'alice@email.com', 28);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('Alice');
    expect(relatorio).toContain('ativo');
  });

  test('deve retornar mensagem quando não há usuários cadastrados', () => {
    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('Nenhum usuário cadastrado.');
  });
});