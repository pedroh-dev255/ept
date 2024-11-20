CREATE DATABASE ept;

USE ept;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
);



CREATE TABLE cliente (
    id INT AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    endereco VARCHAR(500) NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    cpf varchar(14) NOT NULL UNIQUE,
    planideal int NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE financiamento (
    id INT AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_vencimento DATE NOT NULL,
    parcelamento int NOT NULL,
    status int NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id)
);