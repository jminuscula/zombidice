// ===============
// = Application =
// ===============

var zombidiceApp = angular.module('zombidiceApp', []);


// ================
// = Math service =
// ================

zombidiceApp.service('mathService', function(){

  /*
  Binomial functions by Terry Ritter
  Jun 4th, 1998
  http://www.ciphersbyritter.com/JAVASCRP/BINOMPOI.HTM#Binomial
  */

  this.Prb = function Prb(x) {
    x = (x < 0) ? 0 : x;
    return (x > 1) ? 1 : x;
  };

  this.PosV = function PosV(x) {
    return (x < 0) ? -x : x;
  };

  this.Fact = function Fact(x) {
    var t = 1;
    while (x > 1) {
      t *= x--;
    }
    return t;
  };

  this.LnFact = function LnFact(x) {
    // ln(x!) by Stirling's formula --see Knuth I: 111
    if (x <= 1){
      x = 1;
    }

    if (x < 12) {
      return Math.log(this.Fact(Math.round(x)));

    } else {
      var invx = 1 / x,
          invx2 = invx * invx,
          invx3 = invx2 * invx,
          invx5 = invx3 * invx2,
          invx7 = invx5 * invx2;

      var sum = ((x + 0.5) * Math.log(x)) - x;
      sum += Math.log(2 * Math.PI) / 2;
      sum += (invx / 12) - (invx3 / 360);
      sum += (invx5 / 1260) - (invx7 / 1680);

      return sum;
    }
  };

  this.LnComb = function LnComb(n, k) {
    if ((k === 0) || (k === n)){
      return 0;
    } else if ((k > n) || (k < 0)){
      return -1E38;
    } else {
      return (this.LnFact(n) - this.LnFact(k) - this.LnFact(n - k));
    }
  };

  this.BinomTerm = function BinomTerm(p, n, k) {
    // for success probability p and n trials, probability of exactly k successes
    return Math.exp(
      this.LnComb(n, k) +
      k * Math.log(p) +
      (n - k) * Math.log(1 - p)
    );
  };

  this.BinomialDistribution = function BinomialDistribution(p, n, k) {
    // p: probability of success
    // n: number of attempts
    // k: number of successes
    if (k > n){
      k = n;
    }
    return this.BinomTerm(p, n, k);
  };
});


// ===================
// = Main Controller =
// ===================

zombidiceApp.controller('ZombidiceCtrl', ['$scope', 'mathService', function($scope, mathService) {
  $scope.zombies = {
    "walkers": 2,
    "runners": 1,
    "fatties": 1
  };
  $scope.weapons = [
    {
      "id": "pan",
      "type": "close",
      "name": "Pan",
      "min_distance": 0,
      "max_distance": 0,
      "dice": 1,
      "hitpoints": 6,
      "damage": 1,
    },
    {
      "id": "crowbar",
      "type": "close",
      "name": "Crowbar",
      "min_distance": 0,
      "max_distance": 0,
      "dice": 1,
      "hitpoints": 4,
      "damage": 1,
    },
    {
      "id": "fire_axe",
      "type": "close",
      "name": "Fire axe",
      "min_distance": 0,
      "max_distance": 0,
      "dice": 1,
      "hitpoints": 4,
      "damage": 2,
    },
    {
      "id": "machete",
      "type": "close",
      "name": "Machete",
      "double": true,
      "min_distance": 0,
      "max_distance": 0,
      "dice": 1,
      "hitpoints": 4,
      "damage": 2,
    },
    {
      "id": "baseball_bat",
      "type": "close",
      "name": "Baseball bat",
      "min_distance": 0,
      "max_distance": 0,
      "dice": 1,
      "hitpoints": 3,
      "damage": 2,
    },
    {
      "id": "katana",
      "type": "close",
      "name": "Katana",
      "min_distance": 0,
      "max_distance": 0,
      "dice": 2,
      "hitpoints": 4,
      "damage": 1,
    },
    {
      "id": "chainsaw",
      "type": "close",
      "name": "Chainsaw",
      "min_distance": 0,
      "max_distance": 0,
      "dice": 5,
      "hitpoints": 5,
      "damage": 2,
    },
    {
      "id": "pistol",
      "type": "gun",
      "name": "Pistol",
      "double": true,
      "min_distance": 0,
      "max_distance": 1,
      "dice": 1,
      "hitpoints": 4,
      "damage": 1,
    },
    {
      "id": "shotgun",
      "type": "gun",
      "name": "Shotgun",
      "min_distance": 0,
      "max_distance": 1,
      "dice": 2,
      "hitpoints": 4,
      "damage": 2,
    },
    {
      "id": "sawed_off",
      "type": "gun",
      "name": "Sawed off",
      "double": true,
      "min_distance": 0,
      "max_distance": 1,
      "dice": 2,
      "hitpoints": 3,
      "damage": 1,
    },
    {
      "id": "sub_mg",
      "type": "gun",
      "name": "Sub MG",
      "double": true,
      "min_distance": 0,
      "max_distance": 1,
      "dice": 3,
      "hitpoints": 5,
      "damage": 1,
    },
    {
      "id": "rifle",
      "type": "gun",
      "name": "Rifle",
      "min_distance": 0,
      "max_distance": 3,
      "dice": 1,
      "hitpoints": 3,
      "damage": 1,
    },
    {
      "id": "ma_shotgun_blade",
      "type": "special",
      "name": "Ma's shotgun (blade)",
      "min_distance": 0,
      "max_distance": 1,
      "dice": 1,
      "hitpoints": 3,
      "damage": 2,
    },
    {
      "id": "ma_shotgun_gun",
      "type": "special",
      "name": "Ma's shotgun (gun)",
      "min_distance": 0,
      "max_distance": 1,
      "dice": 2,
      "hitpoints": 3,
      "damage": 2,
    },
    {
      "id": "evil_twins",
      "type": "special",
      "name": "Evil twins",
      "min_distance": 0,
      "max_distance": 1,
      "dice": 2,
      "hitpoints": 4,
      "damage": 1,
    },
    {
      "id": "molotov_cocktail",
      "type": "special",
      "name": "Molotov Cocktail",
      "min_distance": 0,
      "max_distance": 1,
      "dice": 1,
      "hitpoints": null,
      "damage": null,
      "probableKills": [100]
    }
  ];
  $scope.selected = [];
  $scope.deadliestWeapon = undefined;
  $scope.safestWeapon = undefined;

  $scope.addZombie = function addZombie(type){
    $scope.zombies[type] += 1;
  };

  $scope.removeZombie = function addZombie(type){
    if ($scope.zombies[type] > 0) {
      $scope.zombies[type] -= 1;
    }
  };

  /*
    Total number of zombies that can be killed with selected weapons
  */
  $scope.zombiesCount = function zombiesCount() {
    var maxDamage = 0,
        count = $scope.zombies.walkers + $scope.zombies.runners;
    for (var i = 0; i < $scope.selected.length; i++){
      if ($scope.selected[i].damage > maxDamage){
        maxDamage = $scope.selected[i].damage;
      }
    }
    return (maxDamage > 1) ? count + $scope.zombies.fatties : count;
  };

  /*
    Adds or removes a weapon from the selected list
  */
  $scope.toggleWeapon = function toggleWeapon(weapon){
    var idx = $scope.selected.indexOf(weapon);
    if (idx === -1) {
      $scope.selected.push(weapon);
      $scope.selected.sort(function sortWeapons(a, b) {
        return a.name > b.name;
      });
      weapon.selected = true;
    } else {
      $scope.selected.splice(idx, 1);
      weapon.selected = false;
    }
  };

  /*
    Returns the name of the selected weapon that can make the greatest number of kills
  */
  $scope.getDeadliestWeapon = function getDeadliestWeapon() {
    if (!$scope.selected.length) {
      return undefined;
    }

    var maxKills = 0,
        idx = 0,
        equal = 0;
    for (var i = 0; i < $scope.selected.length; i++) {
      // maximum rolls is always deadliest
      if ($scope.selected[i].dice > maxKills) {
        maxKills = $scope.selected[i].dice;
        idx = i;
        continue;
      }
      // ensure all weapons have their probabilities ready
      if (!$scope.selected[i].probableKills) {
        $scope.probableKills($scope.selected[i]);
      } else if ($scope.selected[i].probableKills[maxKills] > $scope.selected[idx].probableKills[maxKills]) {
        idx = i;
        equal += 1;
      }
    }

    if (equal == $scope.selected.length) {
      return $scope.getSafestWeapon();
    }
    return $scope.selected[idx].name;
  };

  /*
    Returns the name of the selected weapon that is more probable to kill a single zombie
  */
  $scope.getSafestWeapon = function getSafestWeapon() {
    if (!$scope.selected.length) {
      return undefined;
    }

    var idx = 0,
        pkillOne = 0;
    for (var i = 0; i < $scope.selected.length; i++) {
      if (!$scope.selected[i].probableKills) {
        $scope.probableKills($scope.selected[i]);
      }
      if ($scope.selected[i].probableKills[0] > pkillOne) {
        idx = i;
        pkillOne = $scope.selected[i].probableKills[0];
      }
    }

    return $scope.selected[idx].name;
  };

  /*
    Probability of having a useful roll by a single dice
  */
  function getKillProbability(weapon) {
    return (7 - weapon.hitpoints) / 6;
  }

  /*
    Calculates and caches the probability of a weapon to cause a number of kills
  */
  $scope.probableKills = function probableKills(weapon) {
    if (weapon.probableKills === undefined) {
      var pkills = [],
          prob = getKillProbability(weapon);
      for (var i = weapon.dice; i > 0; i--) {
          var pnk = mathService.BinomialDistribution(prob, weapon.dice, i);
              pkill = (pnk * 100 + (pkills[weapon.dice - i - 1] || 0));
        pkills.push(pkill);
      }
      weapon.probableKills = pkills.reverse();
    }

    $scope.deadliestWeapon = $scope.getDeadliestWeapon();
    $scope.safestWeapon = $scope.getSafestWeapon();
    return weapon.probableKills;
  };

}]);
