// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

contract Campaign {
    struct Request {
        string description;
        uint256 amount;
        address payable recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    // TODO: Add campaign
    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    uint256 public approversCount;
    Request[] public requests;

    function getRequests()
        public
        view
        returns (
            string[] memory descriptionsReturn,
            uint256[] memory amountsReturn,
            address[] memory recipientsReturn,
            bool[] memory completesReturn,
            uint256[] memory approvalCountsReturn
        )
    {
        string[] memory descriptions = new string[](requests.length);
        uint256[] memory amounts = new uint256[](requests.length);
        address[] memory recipients = new address[](requests.length);
        bool[] memory completes = new bool[](requests.length);
        uint256[] memory approvalCounts = new uint256[](requests.length);

        for (uint256 i = 0; i < requests.length; i++) {
            descriptions[i] = requests[i].description;
            amounts[i] = requests[i].amount;
            recipients[i] = requests[i].recipient;
            completes[i] = requests[i].complete;
            approvalCounts[i] = requests[i].approvalCount;
        }

        return (descriptions, amounts, recipients, completes, approvalCounts);
    }

    function isRequestApprovedBySigner(uint256 _requestIdx)
        public
        view
        returns (bool)
    {
        return requests[_requestIdx].approvals[msg.sender];
    }

    modifier onlyManager() {
        require(msg.sender == manager);
        _;
    }

    modifier onlyContributor() {
        require(approvers[msg.sender]);
        _;
    }

    constructor(uint256 minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string memory _description,
        uint256 _amount,
        address _recipient
    ) public onlyManager {
        uint256 requestIndex = requests.length;
        requests.push();
        Request storage newRequest = requests[requestIndex];
        newRequest.description = _description;
        newRequest.amount = _amount;
        newRequest.recipient = payable(_recipient);
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint256 _requestIndex) public onlyContributor {
        Request storage request = requests[_requestIndex];

        require(!request.approvals[msg.sender]);
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint256 _requestIndex) public onlyManager {
        Request storage request = requests[_requestIndex];

        require(!request.complete);
        require(request.approvalCount > (approversCount / 2));

        request.recipient.transfer(request.amount);
        request.complete = true;
    }

    function getRequestApproval(uint256 _requestIndex, address _approvalAddress)
        public
        view
        returns (bool)
    {
        return requests[_requestIndex].approvals[_approvalAddress];
    }
}
