using MediatR;
using UberEats.Domain.Entities;
using UberEats.Domain.Enums;
using UberEats.Domain.Repository;
using System.Threading.Tasks;

namespace UberEats.Application.Orders.CreateOrder;

public sealed record AddressDto(
    string Street, 
    int BuildingNumber, 
    int AppartmentNumber, 
    string City);

public sealed record CreateOrderItem(
    Guid DishId, 
    string DishNameAtPurchase, 
    decimal PriceAtPurchase, 
    int Quantity);

public sealed record CreateOrderCommand(
    Guid CustomerId, 
    Guid RestaurantId, 
    Guid? DriverId, 
    AddressDto Address,
    string? Notes, 
    TimeOnly DeliveryTime, 
    List<CreateOrderItem> Items) : IRequest<Order?>;

public sealed class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, Order?>
{
    private readonly IOrderRepository _orderRepository;

    public CreateOrderCommandHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<Order?> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        var order = new Order(
            Guid.NewGuid(), 
            request.Notes, 
            DateTime.UtcNow, 
            request.DeliveryTime, 
            OrderStatus.WaitingForConfirmation, 
            request.CustomerId, 
            request.RestaurantId, 
            request.DriverId);

        var orderItems = request.Items.Select(item => new OrderItem(
            Guid.NewGuid(), 
            item.DishNameAtPurchase, 
            item.PriceAtPurchase, 
            item.Quantity, 
            order.Id, 
            item.DishId)).ToList();

        order.OrderItems = orderItems;
        
        order.OrderAddress = new OrderAddress(
            Guid.NewGuid(), 
            request.Address.Street, 
            request.Address.BuildingNumber, 
            request.Address.AppartmentNumber, 
            request.Address.City, 
            order.Id);
            
        order.TotalAmount = orderItems.Sum(item => item.PriceAtPurchase * item.Quantity);
        
        await _orderRepository.AddAsync(order);
        await _orderRepository.SaveChangesAsync();
        
        return order;
    }
}