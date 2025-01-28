// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title IFarmRegistry
 * @dev Interface for FarmRegistry contract
 */
interface IFarmRegistry {
    function isFarmVerified(uint256 farmId) external view returns (bool);
    function getFarmOwner(uint256 farmId) external view returns (address);
}

/**
 * @title FarmRegistry
 * @dev Enhanced farm registration and verification system
 */
contract FarmRegistry is AccessControl, Pausable, IFarmRegistry {
    using Counters for Counters.Counter;
    
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    Counters.Counter private _farmIds;
    
    struct FarmLocation {
        string country;
        string region;
        string coordinates; // Latitude and longitude
    }
    
    struct Farm {
        address owner;
        string name;
        FarmLocation location;
        uint256 registrationDate;
        bool isVerified;
        string metadataURI;  // IPFS hash containing additional farm details
        bool isActive;
        mapping(string => string) certificates; // Type => Certificate URI
    }
    
    mapping(uint256 => Farm) public farms;
    mapping(address => uint256[]) public farmerToFarms;
    mapping(address => bool) public registeredFarmers;
    
    uint256 public verificationFee;
    uint256 public registrationFee;
    
    event FarmRegistered(uint256 indexed farmId, address indexed owner, string name);
    event FarmVerified(uint256 indexed farmId, address indexed verifier);
    event FarmUpdated(uint256 indexed farmId, string metadataURI);
    event FarmDeactivated(uint256 indexed farmId);
    event CertificateAdded(uint256 indexed farmId, string certificateType, string certificateUri);
    event FeesUpdated(uint256 newRegistrationFee, uint256 newVerificationFee);
    
    modifier onlyFarmOwner(uint256 farmId) {
        require(farms[farmId].owner == msg.sender, "Not farm owner");
        _;
    }
    
    constructor(uint256 _registrationFee, uint256 _verificationFee) payable {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        registrationFee = _registrationFee;
        verificationFee = _verificationFee;
    }
    
    function registerFarm(
        string memory _name,
        string memory _country,
        string memory _region,
        string memory _coordinates,
        string memory _metadataURI
    ) external payable whenNotPaused returns (uint256) {
        require(msg.value >= registrationFee, "Insufficient registration fee");
        require(bytes(_name).length > 0, "Empty name not allowed");
        
        _farmIds.increment();
        uint256 newFarmId = _farmIds.current();
        
        Farm storage newFarm = farms[newFarmId];
        newFarm.owner = msg.sender;
        newFarm.name = _name;
        newFarm.location = FarmLocation({
            country: _country,
            region: _region,
            coordinates: _coordinates
        });
        newFarm.registrationDate = block.timestamp;
        newFarm.isVerified = false;
        newFarm.metadataURI = _metadataURI;
        newFarm.isActive = true;
        
        farmerToFarms[msg.sender].push(newFarmId);
        registeredFarmers[msg.sender] = true;
        
        emit FarmRegistered(newFarmId, msg.sender, _name);
        return newFarmId;
    }
    
    function verifyFarm(uint256 _farmId) external payable onlyRole(VERIFIER_ROLE) {
        require(msg.value >= verificationFee, "Insufficient verification fee");
        require(!farms[_farmId].isVerified, "Farm already verified");
        require(farms[_farmId].isActive, "Farm not active");
        
        farms[_farmId].isVerified = true;
        emit FarmVerified(_farmId, msg.sender);
    }
    
    function addCertificate(
        uint256 _farmId,
        string memory certificateType,
        string memory certificateUri
    ) external onlyFarmOwner(_farmId) {
        require(farms[_farmId].isActive, "Farm not active");
        farms[_farmId].certificates[certificateType] = certificateUri;
        emit CertificateAdded(_farmId, certificateType, certificateUri);
    }
    
    function updateFarmMetadata(
        uint256 _farmId,
        string memory _newMetadataURI
    ) external onlyFarmOwner(_farmId) {
        require(farms[_farmId].isActive, "Farm not active");
        farms[_farmId].metadataURI = _newMetadataURI;
        emit FarmUpdated(_farmId, _newMetadataURI);
    }
    
    function deactivateFarm(uint256 _farmId) external onlyFarmOwner(_farmId) {
        require(farms[_farmId].isActive, "Farm already deactivated");
        farms[_farmId].isActive = false;
        emit FarmDeactivated(_farmId);
    }
    
    function updateFees(
        uint256 _newRegistrationFee,
        uint256 _newVerificationFee
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        registrationFee = _newRegistrationFee;
        verificationFee = _newVerificationFee;
        emit FeesUpdated(_newRegistrationFee, _newVerificationFee);
    }
    
    // View functions
    function getFarmInfo(uint256 _farmId) external view returns (
        address owner,
        string memory name,
        FarmLocation memory location,
        uint256 registrationDate,
        bool isVerified,
        string memory metadataURI,
        bool isActive
    ) {
        Farm storage farm = farms[_farmId];
        return (
            farm.owner,
            farm.name,
            farm.location,
            farm.registrationDate,
            farm.isVerified,
            farm.metadataURI,
            farm.isActive
        );
    }
    
    function getCertificate(
        uint256 _farmId,
        string memory certificateType
    ) external view returns (string memory) {
        return farms[_farmId].certificates[certificateType];
    }

    function isFarmVerified(uint256 farmId) external view override returns (bool) {
        return farms[farmId].isVerified;
    }

    function getFarmOwner(uint256 farmId) external view override returns (address) {
        return farms[farmId].owner;
    }
}

/**
 * @title InvestmentManager
 * @dev Enhanced investment handling with multiple payment options
 */
contract InvestmentManager is AccessControl, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;
    Counters.Counter private _investmentIds;
    
    enum InvestmentStatus { Active, Withdrawn, Completed }  
    
    struct Investment {
        address investor;
        uint256 farmId;
        uint256 amount;
        uint256 timestamp;
        InvestmentStatus status;
        address tokenAddress; // Zero address for ETH
        uint256 shares; // Proportional ownership
        uint256 minimumLockPeriod;
    }
    
    mapping(uint256 => Investment) public investments;
    mapping(uint256 => uint256) public farmInvestments;
    mapping(address => uint256[]) public investorInvestments;
    mapping(address => bool) public supportedTokens;
    
    IFarmRegistry public immutable farmRegistry;
    
    uint256 public platformFee; // in basis points (1/100 of a percent)
    uint256 public minimumInvestment;
    
    event InvestmentMade(
        uint256 indexed investmentId,
        address indexed investor,
        uint256 indexed farmId,
        uint256 amount,
        address tokenAddress
    );
    event InvestmentWithdrawn(uint256 indexed investmentId, uint256 amount);
    event TokenWhitelisted(address indexed token, bool status);
    event PlatformFeeUpdated(uint256 newFee);
    event MinimumInvestmentUpdated(uint256 newMinimum);
    
    constructor(
        address _farmRegistry,
        uint256 _platformFee,
        uint256 _minimumInvestment
    ) {
        require(_platformFee <= 1000, "Fee too high"); // Max 10%
        farmRegistry = IFarmRegistry(_farmRegistry);
        platformFee = _platformFee;
        minimumInvestment = _minimumInvestment;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        supportedTokens[address(0)] = true; // Enable ETH by default
    }
    
    function invest(
        uint256 _farmId,
        address _tokenAddress,
        uint256 _amount,
        uint256 _lockPeriod
    ) external payable whenNotPaused nonReentrant {
        require(supportedTokens[_tokenAddress], "Token not supported");
        require(_amount >= minimumInvestment, "Below minimum investment");
        require(farmRegistry.isFarmVerified(_farmId), "Farm not verified");
        
        uint256 investmentAmount;
        if (_tokenAddress == address(0)) {
            require(msg.value == _amount, "Incorrect CORE amount");
            investmentAmount = msg.value;
        } else {
            require(msg.value == 0, "CORE not accepted");
            IERC20 token = IERC20(_tokenAddress);
            require(token.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
            investmentAmount = _amount;
        }
        
        uint256 fee = (investmentAmount * platformFee) / 10000;
        uint256 netInvestment = investmentAmount - fee;
        
        _investmentIds.increment();
        uint256 investmentId = _investmentIds.current();
        
        investments[investmentId] = Investment({
            investor: msg.sender,
            farmId: _farmId,
            amount: netInvestment,
            timestamp: block.timestamp,
            status: InvestmentStatus.Active,
            tokenAddress: _tokenAddress,
            shares: _calculateShares(netInvestment, _farmId),
            minimumLockPeriod: block.timestamp + _lockPeriod
        });
        
        farmInvestments[_farmId] += netInvestment;
        investorInvestments[msg.sender].push(investmentId);
        
        // Transfer investment to farm owner
        address farmOwner = farmRegistry.getFarmOwner(_farmId);
        if (_tokenAddress == address(0)) {
            (bool sent, ) = payable(farmOwner).call{value: netInvestment}("");
            require(sent, "Failed to send CORE");
        } else {
            require(IERC20(_tokenAddress).transfer(farmOwner, netInvestment), "Token transfer failed");
        }
        
        emit InvestmentMade(investmentId, msg.sender, _farmId, netInvestment, _tokenAddress);
    }
    
    function withdraw(uint256 _investmentId) external nonReentrant {
        Investment storage investment = investments[_investmentId];
        require(msg.sender == investment.investor, "Not investor");
        require(investment.status == InvestmentStatus.Active, "Investment not active");
        require(block.timestamp >= investment.minimumLockPeriod, "Lock period active");
        
        investment.status = InvestmentStatus.Withdrawn;
        emit InvestmentWithdrawn(_investmentId, investment.amount);
    }
    
    function updateSupportedToken(address _token, bool _status) external onlyRole(DEFAULT_ADMIN_ROLE) {
        supportedTokens[_token] = _status;
        emit TokenWhitelisted(_token, _status);
    }
    
    function updatePlatformFee(uint256 _newFee) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_newFee <= 1000, "Fee too high"); // Max 10%
        platformFee = _newFee;
        emit PlatformFeeUpdated(_newFee);
    }
    
    function updateMinimumInvestment(uint256 _newMinimum) external onlyRole(DEFAULT_ADMIN_ROLE) {
        minimumInvestment = _newMinimum;
        emit MinimumInvestmentUpdated(_newMinimum);
    }
    
    function _calculateShares(uint256 _amount, uint256 _farmId) internal view returns (uint256) {
        if (farmInvestments[_farmId] == 0) {
            return 10000; // 100% if first investor
        }
        return (_amount * 10000) / (farmInvestments[_farmId] + _amount);
    }
}

/**
 * @title ImpactTracker
 * @dev Enhanced impact tracking with verification and weighted scoring
 */
contract ImpactTracker is AccessControl {
    using Counters for Counters.Counter;
    
    bytes32 public constant DATA_PROVIDER_ROLE = keccak256("DATA_PROVIDER_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    
    struct ImpactMetric {
        uint256 farmId;
        string metricType;
        int256 value;
        uint256 timestamp;
        string source;
        bool verified;
        address verifier;
        string verificationData;
    }
    
    struct MetricType {
        string name;
        uint256 weight;
        bool active;
    }
    
    mapping(uint256 => ImpactMetric[]) public farmMetrics;
    mapping(uint256 => uint256) public impactScores;
    mapping(string => MetricType) public metricTypes;
    mapping(string => mapping(address => bool)) public authorizedSources;
    
    Counters.Counter private _metricIds;
    
    event MetricRecorded(
        uint256 indexed farmId,
        string metricType,
        int256 value,
        string source
    );
    event MetricVerified(
        uint256 indexed farmId,
        uint256 indexed metricId,
        address verifier
    );
    event MetricTypeAdded(
        string name,
        uint256 weight
    );
    event SourceAuthorized(
        string metricType,
        address source,
        bool status
    );
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(AUDITOR_ROLE, msg.sender);
    }
    
    function addMetricType(
        string memory _name,
        uint256 _weight
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(metricTypes[_name].weight == 0, "Metric type exists");
        
        metricTypes[_name] = MetricType({
            name: _name,
            weight: _weight,
            active: true
        });
        
        emit MetricTypeAdded(_name, _weight);
    }
    
    function authorizeSource(
        string memory _metricType,
        address _source,
        bool _status
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(metricTypes[_metricType].active, "Invalid metric type");
        authorizedSources[_metricType][_source] = _status;
        emit SourceAuthorized(_metricType, _source, _status);
    }
    
    function recordMetric(
        uint256 _farmId,
        string memory _metricType,
        int256 _value,
        string memory _source
    ) external onlyRole(DATA_PROVIDER_ROLE) {
        require(metricTypes[_metricType].active, "Invalid metric type");
        require(authorizedSources[_metricType][msg.sender], "Unauthorized source");
        
        // _metricIds.increment();
        // uint256 metricId = _metricIds.current();
        
        farmMetrics[_farmId].push(ImpactMetric({
            farmId: _farmId,
            metricType: _metricType,
            value: _value,
            timestamp: block.timestamp,
            source: _source,
            verified: false,
            verifier: address(0),
            verificationData: ""
        }));
        
        emit MetricRecorded(_farmId, _metricType, _value, _source);
        _updateImpactScore(_farmId);
    }
    
    function verifyMetric(
        uint256 _farmId,
        uint256 _metricId,
        string memory _verificationData
    ) external onlyRole(AUDITOR_ROLE) {
        require(_metricId < farmMetrics[_farmId].length, "Invalid metric ID");
        ImpactMetric storage metric = farmMetrics[_farmId][_metricId];
        require(!metric.verified, "Already verified");
        
        metric.verified = true;
        metric.verifier = msg.sender;
        metric.verificationData = _verificationData;
        
        emit MetricVerified(_farmId, _metricId, msg.sender);
        _updateImpactScore(_farmId);
    }
    
    function _updateImpactScore(uint256 _farmId) internal {
        uint256 totalScore = 0;
        uint256 totalWeight = 0;
        
        ImpactMetric[] storage metrics = farmMetrics[_farmId];
        for (uint256 i = 0; i < metrics.length; i++) {
            if (metrics[i].verified) {
                MetricType storage mType = metricTypes[metrics[i].metricType];
                if (mType.active) {
                    // Convert negative values to zero for scoring
                    uint256 value = metrics[i].value < 0 ? 0 : uint256(metrics[i].value);
                    totalScore += value * mType.weight;
                    totalWeight += mType.weight;
                }
            }
        }
        
        if (totalWeight > 0) {
            impactScores[_farmId] = totalScore / totalWeight;
        }
    }
    
    function getMetrics(uint256 _farmId) external view returns (ImpactMetric[] memory) {
        return farmMetrics[_farmId];
    }
}

/**
 * @title Marketplace
 * @dev Enhanced marketplace with order management and escrow
 */
contract Marketplace is AccessControl, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _productIds;
    Counters.Counter private _orderIds;
    
    enum ProductStatus { Draft, Listed, Suspended }
    enum OrderStatus { Created, Paid, Shipped, Completed, Cancelled, Refunded }
    
    struct Product {
        uint256 farmId;
        address seller;
        string name;
        uint256 price;
        uint256 quantity;
        ProductStatus status;
        string metadataURI;
        bool organic;
        string[] certifications;
        uint256 minimumOrder;
        uint256 maximumOrder;
    }
    
    struct Order {
        uint256 productId;
        address buyer;
        uint256 quantity;
        uint256 totalPrice;
        OrderStatus status;
        uint256 timestamp;
        string shippingDetails;
        string trackingNumber;
    }
    
    mapping(uint256 => Product) public products;
    mapping(uint256 => Order) public orders;
    mapping(uint256 => uint256[]) public farmProducts;
    mapping(address => uint256[]) public buyerOrders;
    mapping(address => uint256[]) public sellerOrders;
    
    IFarmRegistry public immutable farmRegistry;
    
    uint256 public platformFee; // in basis points (1/100 of a percent)
    uint256 public escrowPeriod;
    
    event ProductCreated(uint256 indexed productId, uint256 indexed farmId, string name);
    event ProductUpdated(uint256 indexed productId);
    event ProductStatusChanged(uint256 indexed productId, ProductStatus status);
    event OrderCreated(uint256 indexed orderId, uint256 indexed productId, address indexed buyer);
    event OrderStatusUpdated(uint256 indexed orderId, OrderStatus status);
    event TrackingUpdated(uint256 indexed orderId, string trackingNumber);
    
    constructor(
        address _farmRegistry,
        uint256 _platformFee,
        uint256 _escrowPeriod
    ) {
        require(_platformFee <= 1000, "Fee too high"); // Max 10%
        farmRegistry = IFarmRegistry(_farmRegistry);
        platformFee = _platformFee;
        escrowPeriod = _escrowPeriod;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function createProduct(
        uint256 _farmId,
        string memory _name,
        uint256 _price,
        uint256 _quantity,
        string memory _metadataURI,
        bool _organic,
        string[] memory _certifications,
        uint256 _minimumOrder,
        uint256 _maximumOrder
    ) external whenNotPaused returns (uint256) {
        require(farmRegistry.isFarmVerified(_farmId), "Farm not verified");
        require(farmRegistry.getFarmOwner(_farmId) == msg.sender, "Not farm owner");
        require(_price > 0, "Invalid price");
        require(_quantity > 0, "Invalid quantity");
        require(_maximumOrder >= _minimumOrder, "Invalid order limits");
        
        _productIds.increment();
        uint256 productId = _productIds.current();
        
        products[productId] = Product({
            farmId: _farmId,
            seller: msg.sender,
            name: _name,
            price: _price,
            quantity: _quantity,
            status: ProductStatus.Draft,
            metadataURI: _metadataURI,
            organic: _organic,
            certifications: _certifications,
            minimumOrder: _minimumOrder,
            maximumOrder: _maximumOrder
        });
        
        farmProducts[_farmId].push(productId);
        emit ProductCreated(productId, _farmId, _name);
        return productId;
    }
    
    function updateProductStatus(
        uint256 _productId,
        ProductStatus _status
    ) external {
        Product storage product = products[_productId];
        require(msg.sender == product.seller || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Unauthorized");
        product.status = _status;
        emit ProductStatusChanged(_productId, _status);
    }
    
    function createOrder(
        uint256 _productId,
        uint256 _quantity,
        string memory _shippingDetails
    ) external payable whenNotPaused nonReentrant returns (uint256) {
        Product storage product = products[_productId];
        require(product.status == ProductStatus.Listed, "Product not available");
        require(_quantity >= product.minimumOrder, "Below minimum order");
        require(_quantity <= product.maximumOrder, "Exceeds maximum order");
        require(_quantity <= product.quantity, "Insufficient quantity");
        
        uint256 totalPrice = product.price * _quantity;
        require(msg.value == totalPrice, "Incorrect payment");
        
        _orderIds.increment();
        uint256 orderId = _orderIds.current();
        
        orders[orderId] = Order({
            productId: _productId,
            buyer: msg.sender,
            quantity: _quantity,
            totalPrice: totalPrice,
            status: OrderStatus.Paid,
            timestamp: block.timestamp,
            shippingDetails: _shippingDetails,
            trackingNumber: ""
        });
        
        product.quantity -= _quantity;
        if (product.quantity == 0) {
            product.status = ProductStatus.Suspended;
        }
        
        buyerOrders[msg.sender].push(orderId);
        sellerOrders[product.seller].push(orderId);
        
        emit OrderCreated(orderId, _productId, msg.sender);
        return orderId;
    }
    
    function updateOrderStatus(
        uint256 _orderId,
        OrderStatus _status,
        string memory _trackingNumber
    ) external nonReentrant {
        Order storage order = orders[_orderId];
        Product storage product = products[order.productId];
        require(msg.sender == product.seller || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Unauthorized");
        
        if (_status == OrderStatus.Shipped) {
            require(bytes(_trackingNumber).length > 0, "Tracking number required");
            order.trackingNumber = _trackingNumber;
            emit TrackingUpdated(_orderId, _trackingNumber);
        }
        
        order.status = _status;
        
        if (_status == OrderStatus.Completed) {
            uint256 fee = (order.totalPrice * platformFee) / 10000;
            uint256 payment = order.totalPrice - fee;
            (bool sent, ) = payable(product.seller).call{value: payment}("");
            require(sent, "Payment failed");
        } else if (_status == OrderStatus.Refunded) {
            (bool sent, ) = payable(order.buyer).call{value: order.totalPrice}("");
            require(sent, "Refund failed");
        }
        
        emit OrderStatusUpdated(_orderId, _status);
    }
    
    // View functions
    function getProduct(uint256 _productId) external view returns (
        uint256 farmId,
        address seller,
        string memory name,
        uint256 price,
        uint256 quantity,
        ProductStatus status,
        string memory metadataURI,
        bool organic,
        string[] memory certifications,
        uint256 minimumOrder,
        uint256 maximumOrder
    ) {
        Product storage product = products[_productId];
        return (
            product.farmId,
            product.seller,
            product.name,
            product.price,
            product.quantity,
            product.status,
            product.metadataURI,
            product.organic,
            product.certifications,
            product.minimumOrder,
            product.maximumOrder
        );
    }
    
    function getOrder(uint256 _orderId) external view returns (
        uint256 productId,
        address buyer,
        uint256 quantity,
        uint256 totalPrice,
        OrderStatus status,
        uint256 timestamp,
        string memory shippingDetails,
        string memory trackingNumber
    ) {
        Order storage order = orders[_orderId];
        return (
            order.productId,
            order.buyer,
            order.quantity,
            order.totalPrice,
            order.status,
            order.timestamp,
            order.shippingDetails,
            order.trackingNumber
        );
    }
    
    function getFarmProducts(uint256 _farmId) external view returns (uint256[] memory) {
        return farmProducts[_farmId];
    }
    
    function getBuyerOrders(address _buyer) external view returns (uint256[] memory) {
        return buyerOrders[_buyer];
    }
    
    function getSellerOrders(address _seller) external view returns (uint256[] memory) {
        return sellerOrders[_seller];
    }
}

library Counters {
    struct Counter {
        uint256 value;
    }

    function increment(Counter storage counter) internal {
        counter.value += 1;
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter.value;
    }
}