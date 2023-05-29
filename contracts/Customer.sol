// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Customer {

    // event NewIdentityDocument();
    // event NewEmployment(Employment employment);
    event NewPerson(Person person);

    struct PersonalInfo{
        uint dob;
        string name;
        string Address;
        string email;
        string phoneNumber;
    }

    struct IdentityDocument{
        string docmentType;
        uint idNumber;
        uint expiryDate;
        uint issueDate;
    }

    struct Employment{
        string employer;
        string Address;
        string phoneNumber;
        string jobTitle;
        uint salary;
        uint idNumber;
        uint expiryDate;
        uint issueDate;
    }

    struct Person {
        PersonalInfo info;
        IdentityDocument documents;
        Employment employmentInfo;
    }

    // struct Financial{
    //     string employer;
    //     string Address;
    //     string phoneNumber;
    //     string jobTitle;
    //     uint salary;
    //     uint idNumber;
    //     uint expiryDate;
    //     uint issueDate;
    // }

  constructor() public {
  }

    IdentityDocument[] public IdentityDocuments;
    Employment[] public employmentHistory;
    Person[] public persons;

    function _createIdentityDocument(string memory _docmentType, uint _idNumber,uint _expiryDate,uint _issueDate) internal {
        IdentityDocuments.push(IdentityDocument(_docmentType, _idNumber, _expiryDate, _issueDate));
        //emit NewIdentityDocument();
    }

    function _createEmployment(Employment memory employment) internal {
        employmentHistory.push(employment);
        //emit NewEmployment(employment);
    }

    function _createPerson( PersonalInfo memory _info,IdentityDocument memory _ids, Employment memory _employment) internal {
        persons.push(Person( _info,_ids,_employment));
        emit NewPerson(Person(_info,_ids,_employment));
    }
}
