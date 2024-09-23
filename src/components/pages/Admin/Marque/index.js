import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Table, Modal, Form, Container, FormControl } from 'react-bootstrap';
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { getToken } from '../../Account/userStorageService';
const AdminMarques = () => {
  const [marques, setMarques] = useState([]);
  const [currentMarques, setCurrentMarques] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMarque, setSelectedMarque] = useState(null);
  const [formData, setFormData] = useState({ nom: '', nom_ar: '' });
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const marquesPerPage = 5;
  const { t, i18n } = useTranslation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
  const navigate = useNavigate();

  const fetchMarques = async () => {
    try {
      const response = await fetch('http://194.163.173.3:8888/api/marques');
      if (!response.ok) {
        throw new Error('Failed to fetch marques');
      }
      const data = await response.json();
      setMarques(data);
      setCurrentMarques(data.slice(0, marquesPerPage));
    } catch (error) {
      console.error('Error fetching marques:', error.message);
    }
  };

  useEffect(() => {
    fetchMarques();
  }, []);

  useEffect(() => {
    const offset = currentPage * marquesPerPage;
    const filteredMarques = marques.filter(marque => 
      marque.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marque.nom_ar.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCurrentMarques(filteredMarques.slice(offset, offset + marquesPerPage));
  }, [marques, currentPage, searchTerm]);

  const handleDeleteMarque = async (marqueId) => {
    try {
      const response = await fetch(`http://194.163.173.3:8888/api/marques/${marqueId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete marque');
      }
      setMarques(marques.filter(marque => marque.id !== marqueId));
      if (marques.length % marquesPerPage === 1 && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
      Swal.fire({
        title: t('marques.deleted'),
        text: t('marques.deletedMessage'),
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error('Error deleting marque:', error.message);
    }
  };

  const confirmDeleteMarque = (marqueId) => {
    Swal.fire({
      title: t('marques.confirmDelete'),
      text: t('marques.confirmDeleteMessage'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('common.yes'),
      cancelButtonText: t('common.no')
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteMarque(marqueId);
      }
    });
  };

  const handleViewMarque = (marque) => {
    setSelectedMarque(marque);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMarque(null);
  };

  const handleEditMarque = (marque) => {
    setSelectedMarque(marque);
    setFormData({ nom: marque.nom, nom_ar: marque.nom_ar });
    setShowModal(true);
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset to the first page whenever search term changes
  };

  const handleSubmit = async () => {
    try {
      const method = selectedMarque ? 'PUT' : 'POST';
      const url = selectedMarque ? `http://194.163.173.3:8888/api/marques/${selectedMarque.id}` : 'http://194.163.173.3:8888/api/marques';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
         },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error(`Failed to ${selectedMarque ? 'update' : 'create'} marque`);
      }
      setShowModal(false);
      setFormData({ nom: '', nom_ar: '' });
      fetchMarques();
      Swal.fire({
        title: t(`marques.${selectedMarque ? 'updated' : 'created'}`),
        text: t(`marques.${selectedMarque ? 'updatedMessage' : 'createdMessage'}`),
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error(`Error ${selectedMarque ? 'updating' : 'creating'} marque:`, error.message);
    }
  };

  return (
    <Container fluid>
      <br></br>
      <br></br>
      
      <h1 className="mb-4" dir={direction}>{t('marques.title')}</h1>
      <h5 dir={direction}>
        <Link to="#" onClick={() => setShowModal(true)} className="mb-3">
        <Button
      variant="variant"
      style={{ backgroundColor: '#1a4b33', color: 'white' }}
    >
      <FaPlus className="mr-2" /> {t('marques.add')}
    </Button>
        </Link>
      </h5>
      <FormControl
        type="text"
        placeholder={t('products.recherche')}
        className="mb-3"
        value={searchTerm}
        onChange={handleSearchChange}
        dir={direction}
      />
      <Table striped bordered hover className="table-wrapper" dir={direction}>
        <thead>
          <tr>
            <th>{t('marques.nom')}</th>
            <th>{t('marques.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {currentMarques.map(marque => (
            <tr key={marque.id}>
              <td>{i18n.language === 'ar' ? marque.nom_ar : marque.nom}</td>
              <td>
              
                <Button variant="warning" onClick={() => handleEditMarque(marque)} className="ml-1">
                  <FaEdit />
                </Button>
                <Button variant="danger" onClick={() => confirmDeleteMarque(marque.id)} className="ml-1">
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} >
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>{selectedMarque ? t('marques.edit') : t('marques.add')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formMarqueNom">
              <Form.Label>{t('marques.nom')}</Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formMarqueNomAr" className="mt-3">
              <Form.Label>{t('marques.nom_ar')}</Form.Label>
              <Form.Control
                type="text"
                name="nom_ar"
                value={formData.nom_ar}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" className="mt-3" onClick={handleSubmit}>
              {t('marques.submit')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ReactPaginate
        previousLabel={t('pagination.previous')}
        nextLabel={t('pagination.next')}
        pageCount={Math.ceil(marques.filter(marque =>
          marque.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          marque.nom_ar.toLowerCase().includes(searchTerm.toLowerCase())
        ).length / marquesPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
      />
    </Container>
  );
};

export default AdminMarques;