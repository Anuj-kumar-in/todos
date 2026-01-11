// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title TodoToken
 * @dev ERC-20 token used for rewards and governance in todosArena
 */
contract TodoToken is ERC20, AccessControl, ERC20Burnable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1 Billion TODO
    
    event TokensMinted(address indexed to, uint256 amount, string reason);
    event TokensBurned(address indexed from, uint256 amount);
    
    constructor(address initialMinter) ERC20("TODO Arena Token", "TODO") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, initialMinter);
        _grantRole(BURNER_ROLE, msg.sender);
    }
    
    /**
     * @dev Mint new TODO tokens
     * @param to Address to receive tokens
     * @param amount Amount of tokens to mint
     * @param reason Reason for minting (for auditing)
     */
    function mint(
        address to,
        uint256 amount,
        string memory reason
    ) public onlyRole(MINTER_ROLE) {
        require(
            totalSupply() + amount <= TOTAL_SUPPLY,
            "TodoToken: exceeds max supply"
        );
        _mint(to, amount);
        emit TokensMinted(to, amount, reason);
    }
    
    /**
     * @dev Burn tokens
     * @param amount Amount of tokens to burn
     */
    function burnTokens(uint256 amount) public onlyRole(BURNER_ROLE) {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }
    
    /**
     * @dev Check if address has minter role
     */
    function isMinter(address account) public view returns (bool) {
        return hasRole(MINTER_ROLE, account);
    }
}
