// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Image,
//   Button,
//   Modal,
//   Form,
//   Alert,
//   Spinner,
//   Pagination
// } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
// import { getUserId, getlang } from './components/pages/Account/userStorageService';
// import MapModal from './MapModal';
// import './C.css';
// import { removeCartItem, getCartItemCount } from './cartService';

// const Cart = ({ updateCartCount }) => {
//   const { t, i18n } = useTranslation();
//   const navigate = useNavigate();
//   const [direction, setDirection] = useState('ltr');
//   const [cart, setCart] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showMapModal, setShowMapModal] = useState(false);
//   const [orderData, setOrderData] = useState({
//     address: '',
//     orderDescription: ''
//   });
  
//   const [latitude, setLatitude] = useState(null);
//   const [longitude, setLongitude] = useState(null);
//   const [orderPlaced, setOrderPlaced] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [placingOrder, setPlacingOrder] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(2);
//   const userId = getUserId();

//   useEffect(() => {
//     if (i18n.language === 'ar') {
//       setDirection('rtl');
//     } else {
//       setDirection('ltr');
//     }
//   }, [i18n.language]);

//   const fetchCartData = async (lang) => {
//     try {
//       const response = await axios.get(`http://194.163.173.3:8888/api/customer/cart/${userId}`, { params: { lang } });
//       setCart(response.data);
//       updateCartCount(response.data.cartItems.length);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching cart data:', error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const lang = getlang();
//     fetchCartData(lang);
//   }, [userId, updateCartCount, i18n.language]);

//   const handleQuantityChange = async (itemId, delta) => {
//     try {
//       await axios.post('http://194.163.173.3:8888/api/customer/addition', {
//         productId: itemId,
//         userId
//       });
//       const lang = getlang();
//       fetchCartData(lang);
//     } catch (error) {
//       console.error('Error updating quantity:', error);
//     }
//   };

//   const handleDecrementQuantity = async (itemId) => {
//     try {
//       await axios.post('http://194.163.173.3:8888/api/customer/deduction', {
//         productId: itemId,
//         userId
//       });
//       const lang = getlang();
//       fetchCartData(lang);
//     } catch (error) {
//       console.error('Error updating quantity:', error);
//     }
//   };

//   const handleRemoveItem = async (cartItemId) => {
//     try {
//       await removeCartItem(cartItemId);
//       const lang = getlang();
//       fetchCartData(lang);
//     } catch (error) {
//       console.error('Error removing item:', error);
//     }
//   };

//   const handlePlaceOrder = async () => {
//     if (!orderData.address) {
//       setErrorMessage(t('en.Please fill in all fields'));
//       return;
//     }

//     if (orderData.address.length < 8) {
//       setErrorMessage(t('en.Numero must be at least 8 characters.'));
//       return;
//     }

//     setPlacingOrder(true);
//     setErrorMessage('');
//     setSuccessMessage('');

//     try {
//       const orderPayload = {
//         userId,
//         address: orderData.address,
//         orderDescription: orderData.orderDescription,
//         latitude: latitude || null,
//         longitude: longitude || null
//       };
//       const response = await axios.post('http://194.163.173.3:8888/api/customer/placeOrder', orderPayload, {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log('Response from placeOrder API:', response);

//       if (response.status === 200) {
//         setOrderPlaced(true);
//         setCart(null);
//         updateCartCount(0);

//         // Reload the page after placing the order successfully
//         window.location.reload();
//       } else {
//         setSuccessMessage(t('en.Order placed successfully.'));
//         window.location.reload();
//       }
//     } catch (error) {
//       console.error('Error placing order:', error);
//       setErrorMessage(t('en.Failed to place order. Please try again.'));
//     } finally {
//       setPlacingOrder(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setOrderData({
//       ...orderData,
//       [name]: value
//     });
//   };

//   const handleOpenMapModal = () => {
//     setShowMapModal(true);
//   };

//   const setCoordinates = (lat, lng) => {
//     setLatitude(lat);
//     setLongitude(lng);
//     setShowMapModal(false);
//   };

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentCartItems = cart ? cart.cartItems.slice(indexOfFirstItem, indexOfLastItem) : [];

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!userId) {
//     navigate('/SigIn', { state: { message: t('login_redirect_message') } });
//     return null;
//   }

//   return (
//     <Container style={{ direction: direction }}>
//       <Row>
//         <Col md={8}>
//           <h2>{t('en.Cart')}</h2>
//           {successMessage && <Alert variant="success">{successMessage}</Alert>}
//           {orderPlaced ? (
//             <Button 
//               variant="link" 
//               href={`/orders`}  
//               style={{ 
//                 fontFamily: "'Open Sans Condensed', sans-serif", 
//                 fontSize: '1.2rem', 
//                 height: '50px', 
//                 backgroundColor: "rgb(67, 0, 86)"
//               }}
//             >
//               {t('en.View Order Status')}
//             </Button>
//           ) : (
//             <>
//               {cart ? (
//                 <div>
//                   {currentCartItems.map((item) => (
//                     <Card className="mb-3" key={item.id}>
//                       <Row className="g-0">
//                         <Col md={4}>
//                           <Image
//                             src={`data:image/jpeg;base64,${item.returnedImg}`}
//                             thumbnail
//                             style={{ width: '100%', height: '100%' }}
//                           />
//                         </Col>
//                         <Col md={8}>
//                           <Card.Body>
//                             <Card.Title>{item.marque}</Card.Title>
//                             <Card.Text>{t('products.taille')}: {item.taille}</Card.Text>
//                             <Card.Text>{t('en.Price')}: {item.price}</Card.Text>
//                             <div className="d-flex align-items-center">
//                               <Button
//                                 variant="outline-secondary"
//                                 size="sm"
//                                 onClick={() => item.quantity === 1 ? handleRemoveItem(item.id) : handleDecrementQuantity(item.productId)}
//                               >
//                                 {item.quantity === 1 ? (
//                                   <>
//                                     <FontAwesomeIcon icon={faTrash} /> 
//                                   </>
//                                 ) : (
//                                   <FontAwesomeIcon icon={faMinus} />
//                                 )}
//                               </Button>
//                               <span style={{ margin: '0 10px' }}>{item.quantity}</span>
//                               <Button
//                                 variant="outline-secondary"
//                                 size="sm"
//                                 onClick={() => handleQuantityChange(item.productId, 1)}
//                               >
//                                 <FontAwesomeIcon icon={faPlus} />
//                               </Button>
//                             </div>
//                           </Card.Body>
//                         </Col>
//                       </Row>
//                     </Card>
//                   ))}
//                   <Pagination className="mt-3">
//                     {Array.from({ length: Math.ceil(cart.cartItems.length / itemsPerPage) }, (_, index) => (
//                       <Pagination.Item
//                         key={index + 1}
//                         active={index + 1 === currentPage}
//                         onClick={() => paginate(index + 1)}
//                       >
//                         {index + 1}
//                       </Pagination.Item>
//                     ))}
//                   </Pagination>
//                 </div>
//               ) : (
//                 <Button variant="link" href={`/orders`}
//                   style={{ 
//                     fontFamily: "'Open Sans Condensed', sans-serif", 
//                     fontSize: '1.2rem', 
//                     height: '50px', 
//                     backgroundColor: "rgb(67, 0, 86)"
//                   }}>
//                   {t('en.View Order Status')}
//                 </Button>
//               )}
//             </>
//           )}
//         </Col>
//         <Col md={4}>
//           <br></br>
//           <br></br>
//           {cart && (
//             <div className="cart-summary">
//               <p>{t('en.Total Items')}: {cart.cartItems.length}</p>
//               <p>{t('en.Total Amount')}: {cart.totalAmount}</p>
//               <Button variant="primary" onClick={() => setShowModal(true)}>
//                 {t('en.Place Order')}
//               </Button>
//             </div>
//           )}
//         </Col>
//       </Row>

//       <Modal show={showModal} onHide={() => { setShowModal(false); setSuccessMessage(''); setErrorMessage(''); }} >
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>{t('en.Place Order')}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {successMessage && <Alert variant="success">{successMessage}</Alert>}
//           {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
//           <Form>
//             <Form.Group controlId="formAddress">
//               <Form.Label>{t('en.Numero')}</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder={t('en.Enter Numero')}
//                 name="address"
//                 value={orderData.address}
//                 onChange={handleInputChange}
//               />
//             </Form.Group>
//             <br></br>
//             {/* <Button variant="secondary" onClick={handleOpenMapModal}>
//               {t('en.Select on Map')}
//             </Button> */}
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             {t('en.Close')}
//           </Button>
//           <Button variant="primary" onClick={handlePlaceOrder} disabled={placingOrder}>
//             {placingOrder ? <Spinner animation="border" size="sm" /> : t('en.Place Order')}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <MapModal show={showMapModal} handleClose={() => setShowMapModal(false)} setCoordinates={setCoordinates} />
//     </Container>
//   );
// };

// export default Cart;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { getToken } from './components/pages/Account/userStorageService';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Image,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
  Pagination
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getUserId, getlang } from './components/pages/Account/userStorageService';
import MapModal from './MapModal';
import './C.css';
import { removeCartItem, getCartItemCount } from './cartService';

const Cart = ({ updateCartCount }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [direction, setDirection] = useState('ltr');
  const [cart, setCart] = useState(null);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [orderData, setOrderData] = useState({
    address: '',
    orderDescription: '',
    wilayaa: '',
    wilaya: ''
  });
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);
  const userId = getUserId();

  const [minOrderValue, setMinOrderValue] = useState(0);

  useEffect(() => {
    const fetchMinOrderValue = async () => {
      try {
        const response = await axios.get('http://194.163.173.3:8888/api/minOrderValue' ,{
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        });
        console.log('Response:', response.data);
        setMinOrderValue(response.data); 
      } catch (error) {
        console.error('Error fetching minimum order value:', error);
      }
    };
  
    fetchMinOrderValue();
  }, []);

  const wilayas = [
    {
      name: t('wilaya1'),
      moughataas: [
        t('wilaya1mougha1'),
        t('wilaya1mougha2'),
        t('wilaya1mougha3')
      ]
    },
    {
      name: t('wilaya2'),
      moughataas: [
        t('wilaya2mougha1'),
        t('wilaya2mougha2'),
        t('wilaya2mougha3')
      ]
    },
    {
      name: t('wilaya3'),
      moughataas: [
        t('wilaya3mougha1'),
        t('wilaya3mougha2'),
        t('wilaya3mougha3')
      ]
    }
  ];

  useEffect(() => {
    if (i18n.language === 'ar') {
      setDirection('rtl');
    } else {
      setDirection('ltr');
    }
  }, [i18n.language]);

  const fetchCartData = async (lang) => {
    try {
      const response = await axios.get(
        `http://194.163.173.3:8888/api/customer/cart/${userId}`,
        {
          params: { lang },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      
      setCart(response.data);
      updateCartCount(response.data.cartItems.length);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const lang = getlang();
    fetchCartData(lang);
  }, [userId, updateCartCount, i18n.language]);

  const handleQuantityChange = async (itemId, delta) => {
    try {
      await axios.post(
        'http://194.163.173.3:8888/api/customer/addition',
        {
          productId: itemId,
          userId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      
      const lang = getlang();
      fetchCartData(lang);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };
  
  const handleDecrementQuantity = async (itemId) => {
    try {
      await axios.post('http://194.163.173.3:8888/api/customer/deduction', {
        productId: itemId,
        userId
      },{
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const lang = getlang();
      fetchCartData(lang);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await removeCartItem(cartItemId);
      const lang = getlang();
      fetchCartData(lang);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handlePass = async () => { 

    

    if ( calculateTotalAmount() < minOrderValue) {
      setShowModal1(true)
      setErrorMessage(t('Votre montant total est inférieur à la valeur minimale de commande. Veuillez ajouter plus d\'articles à votre panier.'));
      return;
    }

    setShowModal(true);

  }


  const handlePlaceOrder = async () => {
    if (!orderData.address) {
      setErrorMessage(t('en.Please fill in all fields'));
      return;
    }

    if (orderData.address.length < 8) {
      setErrorMessage(t('en.Numero must be at least 8 characters.'));
      return;
    }

    

    
    

    setPlacingOrder(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const orderPayload = {
        userId,
        address: orderData.address,
        orderDescription: orderData.orderDescription,
        wilaya: orderData.wilaya,
        wilayaa: orderData.wilayaa,
        latitude: latitude || null,
        longitude: longitude || null
      };
      const response = await axios.post('http://194.163.173.3:8888/api/customer/placeOrder', orderPayload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,

        }
      });

      console.log('Response from placeOrder API:', response);

      if (response.status === 200) {
        setOrderPlaced(true);
        setCart(null);
        updateCartCount(0);

        // Reload the page after placing the order successfully
        window.location.reload();
      } else {
        setSuccessMessage(t('en.Order placed successfully.'));
        window.location.reload();
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setErrorMessage(t('en.Failed to place order. Please try again.'));
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData({
      ...orderData,
      [name]: value
    });
  };

  const handleWilayaChange = (e) => {
    const selectedWilayaName = e.target.value;
    const selectedWilayaa = wilayas.find(wilaya => wilaya.name === selectedWilayaName);

    setOrderData({
      ...orderData,
      wilayaa: selectedWilayaName,
      wilaya: '', // Reset moughataa when wilaya changes
    });
  };

  const handleMoughataaChange = (e) => {
    setOrderData({
      ...orderData,
      wilaya: e.target.value
    });
  };

  const handleOpenMapModal = () => {
    setShowMapModal(true);
  };

  const setCoordinates = (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
    setShowMapModal(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCartItems = cart ? cart.cartItems.slice(indexOfFirstItem, indexOfLastItem) : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const calculateTotalAmount = () => {
    return cart ? cart.cartItems.reduce((total, item) => total + item.price * item.quantity, 0) : 0;
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  

  if (!userId) {
    navigate('/SigIn', { state: { message: t('login_redirect_message') } });
    return null;
  }

  const selectedWilaya = wilayas.find(w => w.name === orderData.wilayaa);

  return (
    <Container style={{ direction: direction }}>
      <Row>
        <Col md={8}>
          <h2>{t('en.Cart')}</h2>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {orderPlaced ? (
            <Button 
              variant="link" 
              href={`/orders`}  
              style={{ 
                fontFamily: "'Open Sans Condensed', sans-serif", 
                fontSize: '1.2rem', 
                height: '50px', 
                backgroundColor: "rgb(67, 0, 86)"
              }}
            >
              {t('en.View Order Status')}
            </Button>
          ) : (
            <>
              {cart ? (
                <div>
                  {currentCartItems.map((item) => (
                    <Card className="mb-3" key={item.id}>
                      <Row className="g-0">
                        <Col md={4}>
                          <Image
                            src={`data:image/jpeg;base64,${item.returnedImg}`}
                            thumbnail
                            style={{ width: '100%', height: '100%' }}
                          />
                        </Col>
                        <Col md={8}>
                          <Card.Body>
                            <Card.Title>{item.marque}</Card.Title>
                            <Card.Text>{t('products.taille')}: {item.taille}</Card.Text>
                            <Card.Text>{t('en.Price')}: {item.price}</Card.Text>
                            <div className="d-flex align-items-center">
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => item.quantity === 1 ? handleRemoveItem(item.id) : handleDecrementQuantity(item.productId)}
                              >
                                {item.quantity === 1 ? (
                                  <>
                                    <FontAwesomeIcon icon={faTrash} /> 
                                  </>
                                ) : (
                                  <FontAwesomeIcon icon={faMinus} />
                                )}
                              </Button>
                              <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handleQuantityChange(item.productId, 1)}
                              >
                                <FontAwesomeIcon icon={faPlus} />
                              </Button>
                            </div>
                          </Card.Body>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  <Pagination>
                    {Array.from({length: Math.ceil(cart.cartItems.length / itemsPerPage)}, (_, i) => (
                      <Pagination.Item key={i + 1} onClick={() => paginate(i + 1)}>{i + 1}</Pagination.Item>
                    ))}
                  </Pagination>
                  <br />
                  <div className="d-flex justify-content-between">
                    <Button
                      variant="outline-secondary"
                      onClick={handlePass}
                      disabled={!cart.cartItems.length} // Disable if cart is empty
                    >
                      {t('en.Place Order')}
                    </Button>
                    <div>
                      <strong>{t('en.Total Amount')}: </strong>
                      {calculateTotalAmount()} 
                    </div>
                  </div>
                </div>
              ) : (
                <p>{t('en.Your cart is empty.')}</p>
              )}
            </>
          )}
        </Col>
        <Col md={4}>
          {/* ... Your existing code ... */}
        </Col>
      </Row>

      <Modal show={showModal1} onHide={() => { setShowModal1(false); setSuccessMessage(''); setErrorMessage(''); }}>
      <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>{t('en.Place Order')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          </Modal.Body>
      </Modal>

      <Modal show={showModal} onHide={() => { setShowModal(false); setSuccessMessage(''); setErrorMessage(''); }} >
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>{t('en.Place Order')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form>
            <Form.Group controlId="formAddress">
              <Form.Label>{t('en.Numero')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('en.Enter Numero')}
                name="address"
                value={orderData.address}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formWilaya">
              <Form.Label>{t('en.Wilaya')}</Form.Label>
              <Form.Control
                as="select"
                name="wilayaa"
                value={orderData.wilayaa}
                onChange={handleWilayaChange}
              >
                <option value="">{t('en.Select Wilaya')}</option>
                {wilayas.map((wilayaa) => (
                  <option key={wilayaa.name} value={wilayaa.name}>{wilayaa.name}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formMoughataa">
              <Form.Label>{t('en.Moughataa')}</Form.Label>
              <Form.Control
                as="select"
                name="wilaya"
                value={orderData.wilaya}
                onChange={handleMoughataaChange}
                disabled={!orderData.wilayaa}
              >
                <option value="">{t('en.Select Moughataa')}</option>
                {selectedWilaya && selectedWilaya.moughataas.map((wilaya) => (
                  <option key={wilaya} value={wilaya}>{wilaya}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <MapModal show={showMapModal} handleClose={() => setShowMapModal(false)} setCoordinates={setCoordinates} />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowModal(false); setSuccessMessage(''); setErrorMessage(''); }}>
            {t('en.Close')}
          </Button>
          <Button variant="primary" onClick={handlePlaceOrder} disabled={placingOrder}>
            {placingOrder ? <Spinner animation="border" size="sm" /> : t('en.Place Order')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Cart;
