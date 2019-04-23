var Voting = artifacts.require("./Voting.sol");
//This is going to inject all the accounts that exits in the development
//The account can be used for testing purposes

//These are all properties we can attain from the mocha testing
//framework
contract("Voting", function(accounts){
  var qmvotingInstance;
  it("initializes all the candidates", function(){
//Fetches an instance from the deployed contract
    return Voting.deployed().then(function(instance){
//Fetches the number of candidates
      return instance.candidateNumber();
//the value of the account goes into here
    }).then(function(value){
  //assertion is used to ensure that the number of candidates
  //equals to the 3
      assert.equal(value,6);
    });
  });
//Check that the candidates information is correct
  it("initializes candidates with values", function(){
    return Voting.deployed().then(function(instance){
//Assign this to an election instance variable to have scope
//inside the entire test. This allows you to access the instance
//within the promise chain
      qmvotingInstance = instance;
      return qmvotingInstance.candidates(1);
    }).then(function(candidate){
      assert.equal(candidate[0], 1, "correct id");
      assert.equal(candidate[1],"Candidate 1","correct name");
      assert.equal(candidate[2],0,"correct number of votes");
      return qmvotingInstance.candidates(2);
    }).then(function(candidate){
      assert.equal(candidate[0], 2, "correct id");
      assert.equal(candidate[1],"Candidate 2","correct name");
      assert.equal(candidate[2],0,"correct number of votes");
      return qmvotingInstance.candidates(3);
    }).then(function(candidate){
      assert.equal(candidate[0], 3, "correct id");
      assert.equal(candidate[1],"Candidate 3","correct name");
      assert.equal(candidate[2],0,"correct number of votes");
    });
  });

 it("allows students to vote", function(){
    return Voting.deployed().then(function(instance){
      qmvotingInstance = instance;
      idCandidate = 1;
      //When the function is called you the candidateId
      //That we wish to vote for is passed
      //Specifies the account that we wish to vote for
      //to the meta data and account that will be voting is specified
      return qmvotingInstance.elect(idCandidate, {from: accounts[0]});
    //logs the information if the student has voted
    }).then(function(ballot){
        assert.equal(ballot.logs.length,1,"triggered event");
        assert.equal(ballot.logs[0].event, "voted", "student has voted");
        assert.equal(ballot.logs[0].args._idCandidate.toNumber(), idCandidate, "correct id" );
      //reads the student mapping and returns the account of the
      //mapping
      return qmvotingInstance.student(accounts[0]);
      //does not log the information if the student has voted already
    }).then(function(voted){
      //if the student has not voted it will fetch the candidate
      //out of the mapping
      assert(voted, "this student has now voted");
      return qmvotingInstance.candidates(idCandidate);
    }).then(function(candidate){
      //Reads the number of votes the candidate has recieved so far
      var voteNumber = candidate[2];
      //Assert it as equating to one
      assert.equal(voteNumber, 1 , "candidate vote is incremented");
    })
  });

   it("Exception thrown if tries to vote twice", function(){
     return Voting.deployed().then(function(instance){
       qmvotingInstance = instance;
       idCandidate = 4;
       //This insures that you vote once for the candidate
       qmvotingInstance.elect(idCandidate, { from: accounts[1] });
       return qmvotingInstance.candidates(idCandidate);
       //The candidate is read out of the candidates mapping
    }).then(function(candidate){
      var voteNumber = candidate[2];
      //Ensure that the vote count did increment the first
      //time that the vote was submitted
      assert.equal(voteNumber, 1, "Your vote has been accepted");
      //Second vote is attempted from the same account
      return qmvotingInstance.elect(idCandidate, { from: accounts[1] });
    }).then(assert.fail).catch(function(error){
      //check the indexOF revert inside the error message exists
      assert(error.message.indexOf('revert') >=0, "must contain revert in error message");
      //ensure that the state of the contract is unchanged
      //for all candidates

      return qmvotingInstance.candidates(1);
    }).then(function(candidate1) {
      var voteNumber = candidate1[2];
      assert.equal(voteNumber, 1, "'candidate 1 did not recieve any votes");

      return qmvotingInstance.candidates(2);
    }).then(function(candidate2) {
      var voteNumber = candidate2[2];
      assert.equal(voteNumber, 0,"candidate 2 did not recieve any votes");

      return qmvotingInstance.candidates(3);
    }).then(function(candidate3) {
      var voteNumber = candidate3[2];
      assert.equal(voteNumber, 0, "candidate 3 did not recieve any votes");

    });
  });
});
