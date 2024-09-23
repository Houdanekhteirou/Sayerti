import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaEdit, FaLanguage } from 'react-icons/fa';
import { Container, Row, Col, Button, Form, Modal, Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import './Categorie.css';
import { getToken } from '../../Account/userStorageService';
const CategoryManagement = () => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [currentCategories, setCurrentCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', parentCategoryId: null });
  const [parentCategories, setParentCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showTranslateForm, setShowTranslateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [arabicName, setArabicName] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const categoriesPerPage = 5;

  const handleChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleArabicNameChange = (e) => {
    setArabicName(e.target.value);
  };

  const getDirection = (lang) => {
    if (['ar', 'he', 'fa', 'ur'].includes(lang)) {
      return 'rtl';
    }
    return 'ltr';
  };

  const [direction, setDirection] = useState(getDirection(i18n.language));

  useEffect(() => {
    setDirection(getDirection(i18n.language));
  }, [i18n.language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://194.163.173.3:8888/api/admin/category', newCategory , {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      });
      Swal.fire({
        icon: 'success',
        title: t('messages.new_category_created'),
        text: response.data.name,
      });
      fetchCategories();
      setNewCategory({ name: '', description: '', parentCategoryId: null });
      setShowForm(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('messages.error_creating_category'),
        text: error.message,
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://194.163.173.3:8888/api/admin/${currentCategory.id}`, newCategory,{
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      });
      Swal.fire({
        icon: 'success',
        title: t('messages.category_updated'),
      });
      fetchCategories();
      setShowUpdateForm(false);
      setNewCategory({ name: '', description: '', parentCategoryId: null });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('messages.error_updating_category'),
        text: error.message,
      });
    }
  };

  const handleTranslate = async () => {
    setShowTranslateForm(true);
    setArabicName(currentCategory?.arabicName || '');
  };

  const handleSaveArabicName = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://194.163.173.3:8888/api/admin/category/${currentCategory.id}/translate`,
        { nom_ar: arabicName },{
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      Swal.fire({
        icon: 'success',
        title: t('messages.arabic_name_saved'),
      });
      fetchCategories();
      setShowTranslateForm(false);
      setArabicName('');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('messages.error_saving_arabic_name'),
        text: error.message,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://194.163.173.3:8888/api/admin/${currentCategory.id}`,{
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      });
      Swal.fire({
        icon: 'success',
        title: t('messages.category_deleted'),
      });
      fetchCategories();
      setShowDeleteForm(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('messages.error_deleting_category'),
        text: error.message,
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const lang = i18n.language;
      const response = await axios.get('http://194.163.173.3:8888/api/admin/ouvert/categories', { params: { lang } });
      setCategories(response.data);
      setFilteredCategories(response.data); // Ajoutez cette ligne
      setCurrentCategories(response.data.slice(0, categoriesPerPage));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('messages.error_fetching_categories'),
        text: error.message,
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [i18n.language]);

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    const offset = selectedPage * categoriesPerPage;
    setCurrentPage(selectedPage);
    setCurrentCategories(filteredCategories.slice(offset, offset + categoriesPerPage));
  };

  useEffect(() => {
    const lang = i18n.language;
    axios.get('http://194.163.173.3:8888/api/admin/ouvert/categories', { params: { lang } })
      .then(response => {
        setParentCategories(response.data);
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error fetching parent categories',
          text: error.message,
        });
      });
  }, []);

  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
    setCurrentCategories(filtered.slice(0, categoriesPerPage));
    setCurrentPage(0);
  }, [searchTerm, categories]);

  return (
    <Container fluid style={{ direction }}>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Row className="justify-content-center">
        <Col xs={12} md={4} className="mb-3">
          <div className="text-center">
            <Button variant="primary" onClick={() => setShowForm(true)}>
              <FaPlus className="mr-2" /> {t('buttons.add_category')}
            </Button>
          </div>
        </Col>
        <Col xs={12} md={8} className="mb-3">
          <Form.Group>
            <Form.Control
              type="text"
              placeholder={t('products.recherche')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div className="table-container">
            <div className="table-wrapper">
              <Table striped bordered hover responsive>
                <thead className="admin-products__table-header">
                  <tr>
                    <th>{t('labels.id')}</th>
                    <th>{t('labels.name')}</th>
                    <th>{t('labels.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCategories.map((category) => (
                    <tr key={category.id} className="admin-products__table-row">
                      <td>{category.id}</td>
                      <td>{category.name}</td>
                      <td>
                        <Button
                          variant="warning"
                          className="mr-2 mb-1"
                          onClick={() => {
                            setCurrentCategory(category);
                            setNewCategory({ name: category.name, description: category.description, parentCategoryId: category.parentCategoryId });
                            setShowUpdateForm(true);
                          }}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="info"
                          className="mr-2 mb-1"
                          onClick={() => {
                            setCurrentCategory(category);
                            handleTranslate();
                          }}
                        >
                          <FaLanguage />
                        </Button>
                        <Button
                          variant="danger"
                          className="mb-1"
                          onClick={() => {
                            setCurrentCategory(category);
                            setShowDeleteForm(true);
                          }}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="d-flex justify-content-center">
                <ReactPaginate
                  previousLabel={t('buttons.previous')}
                  nextLabel={t('buttons.next')}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={Math.ceil(filteredCategories.length / categoriesPerPage)}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName={'pagination'}
                  activeClassName={'active'}
                  pageLinkClassName={'page-link'}
                  previousLinkClassName={'page-link'}
                  nextLinkClassName={'page-link'}
                  disabledClassName={'disabled'}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton className="custom-modal-header" >
          <Modal.Title >{t('buttons.add_category')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formCategoryName">
              <Form.Label>{t('labels.name')}</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleChange}
                placeholder={t('placeholders.category_name')}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formParentCategory">
              <Form.Label>{t('labels.parent_category')}</Form.Label>
              <Form.Control
                as="select"
                name="parentCategoryId"
                value={newCategory.parentCategoryId}
                onChange={handleChange}
              >
                <option value={null}>{t('labels.no_parent_category')}</option>
                {parentCategories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className="btn-block">
              {t('buttons.create_category')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showUpdateForm} onHide={() => setShowUpdateForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('buttons.update_category')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3" controlId="formUpdateCategoryName">
              <Form.Label>{t('labels.name')}</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleChange}
                placeholder={t('placeholders.category_name')}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formUpdateParentCategory">
              <Form.Label>{t('labels.parent_category')}</Form.Label>
              <Form.Control
                as="select"
                name="parentCategoryId"
                value={newCategory.parentCategoryId}
                onChange={handleChange}
              >
                <option value={null}>{t('labels.no_parent_category')}</option>
                {parentCategories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className="btn-block">
              {t('buttons.update_category')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showTranslateForm} onHide={() => setShowTranslateForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('buttons.translate_category')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveArabicName}>
            <Form.Group className="mb-3" controlId="formArabicName">
              <Form.Label>{t('labels.arabic_name')}</Form.Label>
              <Form.Control
                type="text"
                value={arabicName}
                onChange={handleArabicNameChange}
                placeholder={t('placeholders.arabic_name')}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="btn-block">
              {t('products.save_arabic_name')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showDeleteForm} onHide={() => setShowDeleteForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('buttons.delete_category')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t('messages.confirm_delete_category', { categoryName: currentCategory?.name })}</p>
          <Button variant="danger" onClick={handleDelete} className="mr-2">
            {t('buttons.delete')}
          </Button>
          <Button variant="secondary" onClick={() => setShowDeleteForm(false)}>
            {t('buttons.cancel')}
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CategoryManagement;
