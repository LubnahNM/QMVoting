pragma solidity ^0.4.11;

contract Voting {
  //Constructor is always run whenever the contract is started
  //upon migrations

  //Gives a state variable that can be stored as a string
  //State variable is a getter function
  string public candidate;

  struct Candidate{
    uint id;
    string candidateName;
    uint voteNumber;

  }
  //stores the number of candidates involved
  uint public candidateNumber;

  //stores the number of badminton candidates that are involved
  uint public badmintonNumber;

  // Stores the accounts that have voted
  // Keeps track that the voter has voted
  mapping(address => bool) public student;

  mapping(address => bool) public studentSociety;


  //Fetches the candidates to select from
  mapping(uint => Candidate) public candidates;

  //Fetches the badminton candidates to select
  mapping(uint => Candidate) public badmintonCandidates;

  //Ensures outsiders can not change the candidates that have
  //been nominated

  event voted(
    uint indexed _idCandidate
  );


  function addSU (string _name) private{
    candidateNumber++;
    candidates[candidateNumber] = Candidate(candidateNumber, _name, 0);

  }

  function addBadminton (string _name) private{
    badmintonNumber++;
    badmintonCandidates[badmintonNumber] = Candidate(badmintonNumber, _name, 0);
  }


  constructor() public{
    //the state variable represents data that belongs to the entire
    //contract
    addSU("Candidate 1");
    addSU("Candidate 2");
    addSU("Candidate 3");
    addBadminton("Candidate 4");
    addBadminton("Candidate 5");
    addBadminton("Candidate 6");
  }

  function elect (uint _idCandidate) public{
    //voter must not have voted before
    //checks that address is not in student mapping
    require(!student[msg.sender]);

    //The candidate that is being voted is in the Candidate mapping
    uint totalCandidates = candidateNumber + badmintonNumber;
    require(_idCandidate > 0 && _idCandidate <= totalCandidates);

    //Records that the student has voted
    student[msg.sender] = true;

    //Updates candidates vote number
    candidates[_idCandidate].voteNumber ++;


  emit voted(_idCandidate);

  }

  function societyElection(uint _idCandidate) public{

  require(!studentSociety[msg.sender]);

  uint totalCandidates = candidateNumber + badmintonNumber;
  require(_idCandidate > 0 && _idCandidate <= totalCandidates);

  //Records that the student has voted
  studentSociety[msg.sender] = true;

  badmintonCandidates[_idCandidate].voteNumber ++;


  emit voted(_idCandidate);

  }






}
