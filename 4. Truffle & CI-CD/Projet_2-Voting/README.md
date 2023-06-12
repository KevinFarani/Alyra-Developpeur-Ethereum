# Projet Voting - Test Unitaires

Projet de fin de chapitre sur les Test Unitaire.

Ce projet a été réalisé à l'aide de Truffle.

L'exécution est prévue pour être effectuée en locale via la blockchain Ganache.

## Installation

Rendez-vous dans le dossier via Ubuntu puis executez les commandes suivantes :

### Truffle
```bash
npm install truffle

truffle init
```

### Ganache
```bash
npm install ganache
```

### Openzepplin
```bash
npm install --save-exact openzeppelin-solidity

npm install @openzeppelin/contracts
```

## Utilisation

Via l'invite de commande Ubuntu, lancez la blockchain Ganache :

```bash
ganache
```

Dans un autre invite de commande, exécutez les commandes suivantes :

```bash
truffle migrate

truffle test
```

## Organisation

Les tests suivent les étapes (Workflow Status) de fonctionnement du contrat Voting.

A chaque nouvel étape, on s'assure que les fonctions prévues fonctionnent bien en testant :
- Fonctionnalité
- Require(s)
- Event(s)

Mais aussi que les fonctions non prévues dans l'étape en cours soient bien inactives.


## License

[MIT](https://choosealicense.com/licenses/mit/)