pragma solidity >=0.5.0;

contract CustomerKYC {
    struct Customer {
        uint256 id;
        string name;
        string email;
        bool isVerified;
    }

    mapping(address => Customer) public customers;
    uint256 public customerCount;

    event CustomerRegistered(address indexed customerAddress, uint256 customerId);

    function registerCustomer(string memory _name, string memory _email) public {
        require(customers[msg.sender].id == 0, "Customer already registered");

        customerCount++;
        customers[msg.sender] = Customer(customerCount, _name, _email, false);

        emit CustomerRegistered(msg.sender, customerCount);
    }

    function verifyCustomer(address _customerAddress) public {
        require(customers[_customerAddress].id != 0, "Customer not found");

        customers[_customerAddress].isVerified = true;
    }

    function getCustomer(address _customerAddress) public view returns (
        uint256 id,
        string memory name,
        string memory email,
        bool isVerified
    ) {
        require(customers[_customerAddress].id != 0, "Customer not found");

        Customer memory customer = customers[_customerAddress];
        return (
            customer.id,
            customer.name,
            customer.email,
            customer.isVerified
        );
    }
}
