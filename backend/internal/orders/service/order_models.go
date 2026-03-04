package service

import "time"

type OrderServiceModel struct {
	CategoryID    string   `json:"category_id"`
	CategoryName  string   `json:"category_name"`
	SelectedUnit  string   `json:"selected_unit"`
	QuantityValue float64  `json:"quantity_value"`
	Items         []string `json:"items,omitempty"`
	Description   string   `json:"description,omitempty"`
}

type OrderSummary struct {
	ID            string    `json:"id"`
	RequestID     string    `json:"request_id"`
	FinalPrice    string    `json:"final_price"`
	OrderStatus   string    `json:"order_status"`
	PaymentStatus string    `json:"payment_status"`
	CreatedAt     time.Time `json:"created_at"`

	VendorName  string `json:"vendor_name,omitempty"`
	VendorPhone string `json:"vendor_phone,omitempty"`

	UserName  string `json:"user_name,omitempty"`
	UserPhone string `json:"user_phone,omitempty"`

	PickupAddress string `json:"pickup_address"`

	Services []OrderService `json:"services"`
}

type OrderDetail struct {
	ID            string `json:"id"`
	RequestID     string `json:"request_id"`
	FinalPrice    string `json:"final_price"`
	OrderStatus   string `json:"order_status"`
	PaymentStatus string `json:"payment_status"`

	PickupTime   *time.Time `json:"pickup_time,omitempty"`
	DeliveryTime *time.Time `json:"delivery_time,omitempty"`

	CreatedAt time.Time `json:"created_at"`

	User UserInfo `json:"user"`

	Vendor VendorInfo `json:"vendor"`

	Request RequestInfo `json:"request"`

	Services []OrderService `json:"services"`
}

type UserInfo struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Phone string `json:"phone"`
}

type VendorInfo struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Phone string `json:"phone"`
}

type RequestInfo struct {
	PickupAddress  string    `json:"pickup_address"`
	PickupTimeFrom time.Time `json:"pickup_time_from"`
	PickupTimeTo   time.Time `json:"pickup_time_to"`
	PaymentMethod  string    `json:"payment_method"`
}
