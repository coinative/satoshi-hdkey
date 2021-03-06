var HDKey = require('../');
var base58 = require('satoshi-base58');

function hex(hex) { return new Buffer(hex, 'hex'); };

var bip32Vectors = require('./fixtures/bip32-vectors.json');

describe('HDKey BIP32 vectors', function () {
  bip32Vectors.forEach(function (vector, i) {
    var key = new HDKey({ seed: hex(vector.m) });

    describe('Test vector ' + (i + 1), function () {
      vector.chains.forEach(function (chain) {
        var derived = new HDKey(key);

        chain.path.forEach(function (index) {
          if (index.indexOf('H') > -1) {
            derived = derived.deriveHardened(parseInt(index.slice(0, -1)));
          } else {
            derived = derived.derive(parseInt(index));
          }
        });

        it('m' + (chain.path.length ? '/' + chain.path.join('/') : ''), function () {
          expect(derived.id.toString('hex')).to.equal(chain.id);
          expect(derived.getAddress().toString()).to.equal(chain.address);
          expect(derived.prv.toString('hex')).to.equal(chain.prv);
          expect(derived.pub.toString('hex')).to.equal(chain.pub);
          expect(derived.chain.toString('hex')).to.equal(chain.chain);
          expect(derived.toString()).to.equal(chain.xpub);
          expect(derived.toString(true)).to.equal(chain.xprv);
        });
      });
    });
  });
});
