const { expect } = require('chai');
const userController = require('../src/controllers/user');
const db = require('../src/dbClient');

describe('User', () => {
  
  beforeEach(() => {
    // Clean DB before each test
    db.flushdb();
  });

  describe('Create', () => {

    it('create a new user', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      };
      userController.create(user, (err, result) => {
        expect(err).to.be.equal(null);
        expect(result).to.be.equal('OK');
        done();
      });
    });

    it('passing wrong user parameters', (done) => {
      const user = {
        firstname: 'Sergei',
        lastname: 'Kudinov'
      };
      userController.create(user, (err, result) => {
        expect(err).to.not.be.equal(null);
        expect(result).to.be.equal(null);
        done();
      });
    });

    it('avoid creating an existing user', (done)=> {
      const existingUser = {
        username: 'existinguser',
        firstname: 'Existing',
        lastname: 'User'
      };

      userController.create(existingUser, (err, result) => {
        expect(err).to.be.equal(null);
        expect(result).to.be.equal('OK');

        userController.create(existingUser, (duplicateErr, duplicateResult) => {
          expect(duplicateErr).to.not.be.equal(null);
          expect(duplicateResult).to.be.equal(null);
          done();
        });
      });
    });
  });

  describe('Get', ()=> {
    
    it('get a user by username', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      };

      userController.create(user, (err, result) => {
        expect(err).to.be.equal(null);
        expect(result).to.be.equal('OK');

        userController.get(user.username, (getErr, getUser) => {
          expect(getErr).to.be.equal(null);
          expect(getUser).to.deep.equal(user);
          done();
        });
      });
    });

    it('cannot get a user when it does not exist', (done) => {
      const nonExistentUsername = 'nonexistentuser';

      userController.get(nonExistentUsername, (err, result) => {
        expect(err).to.not.be.equal(null);
        expect(result).to.be.equal(null);
        done();
      });
    });
  });
});
