// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title RedPacket - Simple on-chain red packet (lucky money)
/// @notice Allows a sender to create a red packet with N claims and a total ether amount.
///         Participants can claim once and receive a pseudo-random share. For demo/testing only.
contract RedPacket {
    struct Packet {
        // 发送者
        address sender;
        // 总共多少个
        uint256 total;
        // 红包里剩余的金额
        uint256 remaining;
        // 剩余多少个
        uint256 remainingCount;
        bool finished;
        // 记录谁已经领过
        mapping(address => bool) claimed;
    }

    // auto-increment id => Packet
    uint256 public nextId = 1;

    // 私有的红包
    mapping(uint256 => Packet) private packets;

    uint256 private locked = 1;

    event RedPacketCreated(
        uint256 indexed id,
        address indexed sender,
        uint256 amount,
        uint256 count
    );
    event RedPacketClaimed(uint256 indexed id, address indexed user, uint256 amount);
    event RedPacketFinished(uint256 indexed id);

    // minimal reentrancy guard
    modifier nonReentrant() {
        require(locked == 1, "REENTRANT");
        locked = 2;
        _;
        locked = 1;
    }

    /// @notice Create a new red packet
    /// @param count Number of claims available
    /// @return id The created packet id
    function createRedPacket(
        uint256 count
    ) external payable returns (uint256 id) {
        require(count > 0, "count=0");
        require(msg.value > 0, "no value");
        require(msg.value >= count, "value < count (min 1 wei each)");

        id = nextId++;
        Packet storage p = packets[id];
        p.sender = msg.sender;
        p.total = msg.value;
        p.remaining = msg.value;
        p.remainingCount = count;
        p.finished = false;

        emit RedPacketCreated(id, msg.sender, msg.value, count);
    }

    /// @notice Claim from a packet
    function claimRedPacket(uint256 id) external nonReentrant {
        Packet storage p = packets[id];
        require(p.sender != address(0), "not found");
        require(!p.finished, "finished");
        require(p.remainingCount > 0, "none left");
        require(!p.claimed[msg.sender], "already claimed");

        uint256 amount;
        if (p.remainingCount == 1) {
            amount = p.remaining; // last claimer gets all remaining
        } else {
            // ensure at least 1 wei remains for each of the rest
            uint256 max = p.remaining - (p.remainingCount - 1);
            // pseudo-random for demo purposes only
            uint256 rand = uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        msg.sender,
                        p.remaining,
                        p.remainingCount
                    )
                )
            );
            amount = (rand % max) + 1; // [1, max]
        }

        // effects
        p.claimed[msg.sender] = true;
        p.remaining -= amount;
        p.remainingCount -= 1;

        // interactions
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "transfer failed");

        emit RedPacketClaimed(id, msg.sender, amount);

        if (p.remainingCount == 0) {
            p.finished = true;
            emit RedPacketFinished(id);
        }
    }

    /// @notice Get packet info for UI
    function getPacket(
        uint256 id
    )
        external
        view
        returns (
            address sender,
            uint256 total,
            uint256 remaining,
            uint256 remainingCount,
            bool finished
        )
    {
        Packet storage p = packets[id];
        return (p.sender, p.total, p.remaining, p.remainingCount, p.finished);
    }

    /// @notice Whether an address has claimed a packet
    function hasClaimed(uint256 id, address user) external view returns (bool) {
        Packet storage p = packets[id];
        require(p.sender != address(0), "not found");
        return p.claimed[user];
    }
}
