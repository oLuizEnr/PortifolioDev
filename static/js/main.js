/**
 * Main JavaScript file for Portfolio Application
 * Handles dark mode, interactive features, and UI enhancements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initDarkMode();
    initFormValidation();
    initImagePreview();
    initTooltips();
    initScrollEffects();
    initModalHandlers();
    initCharacterCounters();
    initLazyLoading();
    
    console.log('Portfolio app initialized successfully');
});

/**
 * Dark Mode Toggle Functionality
 */
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');
    const htmlElement = document.documentElement;
    
    if (!darkModeToggle || !darkModeIcon) return;
    
    // Get saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    // Toggle button event listener
    darkModeToggle.addEventListener('click', function() {
        const currentTheme = htmlElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add animation effect
        darkModeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            darkModeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });
    
    function setTheme(theme) {
        htmlElement.setAttribute('data-bs-theme', theme);
        
        if (theme === 'dark') {
            darkModeIcon.className = 'fas fa-sun';
            darkModeToggle.title = 'Modo claro';
        } else {
            darkModeIcon.className = 'fas fa-moon';
            darkModeToggle.title = 'Modo escuro';
        }
    }
}

/**
 * Form Validation Enhancement
 */
function initFormValidation() {
    // Add real-time validation feedback
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', debounce(validateField, 300));
        });
        
        // Enhanced form submission
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateField.call(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showNotification('Por favor, corrija os erros no formulário.', 'error');
            } else {
                // Show loading state
                const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.textContent;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Salvando...';
                    
                    // Restore button after 5 seconds as fallback
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                    }, 5000);
                }
            }
        });
    });
    
    function validateField() {
        const field = this;
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        const fieldType = field.type;
        let isValid = true;
        let message = '';
        
        // Remove existing feedback
        clearFieldFeedback(field);
        
        // Required field validation
        if (isRequired && !value) {
            isValid = false;
            message = 'Este campo é obrigatório.';
        }
        
        // Email validation
        if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Por favor, insira um email válido.';
            }
        }
        
        // URL validation
        if (fieldType === 'url' && value) {
            try {
                new URL(value);
            } catch {
                isValid = false;
                message = 'Por favor, insira uma URL válida.';
            }
        }
        
        // Password strength validation
        if (fieldType === 'password' && value && field.name === 'password') {
            if (value.length < 6) {
                isValid = false;
                message = 'A senha deve ter pelo menos 6 caracteres.';
            }
        }
        
        // Password confirmation validation
        if (field.name === 'password2') {
            const passwordField = document.querySelector('input[name="password"]');
            if (passwordField && value !== passwordField.value) {
                isValid = false;
                message = 'As senhas não coincidem.';
            }
        }
        
        // Show feedback
        showFieldFeedback(field, isValid, message);
        
        return isValid;
    }
    
    function showFieldFeedback(field, isValid, message) {
        field.classList.remove('is-valid', 'is-invalid');
        field.classList.add(isValid ? 'is-valid' : 'is-invalid');
        
        if (!isValid && message) {
            const feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            feedback.textContent = message;
            field.parentNode.appendChild(feedback);
        }
    }
    
    function clearFieldFeedback(field) {
        field.classList.remove('is-valid', 'is-invalid');
        const existingFeedback = field.parentNode.querySelector('.invalid-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
    }
}

/**
 * Image Preview for File Uploads
 */
function initImagePreview() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        if (input.accept && input.accept.includes('image')) {
            input.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        showImagePreview(input, e.target.result, file.name);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    });
    
    function showImagePreview(input, src, filename) {
        // Remove existing preview
        const existingPreview = input.parentNode.querySelector('.image-preview');
        if (existingPreview) {
            existingPreview.remove();
        }
        
        // Create preview element
        const preview = document.createElement('div');
        preview.className = 'image-preview mt-2';
        preview.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${src}" alt="Preview" class="img-thumbnail me-3" style="max-width: 100px; max-height: 100px;">
                <div>
                    <small class="text-muted d-block">${filename}</small>
                    <button type="button" class="btn btn-sm btn-outline-danger mt-1 remove-preview">
                        <i class="fas fa-times me-1"></i>Remover
                    </button>
                </div>
            </div>
        `;
        
        input.parentNode.appendChild(preview);
        
        // Add remove functionality
        preview.querySelector('.remove-preview').addEventListener('click', function() {
            input.value = '';
            preview.remove();
        });
    }
}

/**
 * Initialize Bootstrap Tooltips
 */
function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"], [title]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        // Only initialize if not already initialized
        if (!tooltipTriggerEl._tooltip) {
            tooltipTriggerEl._tooltip = new bootstrap.Tooltip(tooltipTriggerEl);
        }
    });
}

/**
 * Scroll Effects and Animations
 */
function initScrollEffects() {
    // Navbar background opacity on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.backgroundColor = 'rgba(33, 37, 41, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.backgroundColor = '';
                navbar.style.backdropFilter = '';
            }
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Fade in animation for cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe cards and other elements
    document.querySelectorAll('.card, .timeline-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/**
 * Modal Handlers
 */
function initModalHandlers() {
    // Close modal on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
        });
    });
    
    // Auto-focus first input in modals
    document.addEventListener('shown.bs.modal', function(e) {
        const firstInput = e.target.querySelector('input:not([type="hidden"]), textarea, select');
        if (firstInput) {
            firstInput.focus();
        }
    });
}

/**
 * Character Counters for Text Fields
 */
function initCharacterCounters() {
    const textFields = document.querySelectorAll('textarea[maxlength], input[maxlength]');
    
    textFields.forEach(field => {
        const maxLength = parseInt(field.getAttribute('maxlength'));
        if (maxLength) {
            createCharacterCounter(field, maxLength);
        }
    });
    
    function createCharacterCounter(field, maxLength) {
        const counter = document.createElement('div');
        counter.className = 'form-text text-end character-counter';
        field.parentNode.appendChild(counter);
        
        function updateCounter() {
            const remaining = maxLength - field.value.length;
            counter.textContent = `${remaining} caracteres restantes`;
            
            if (remaining < 20) {
                counter.className = 'form-text text-end character-counter text-warning';
            } else if (remaining < 10) {
                counter.className = 'form-text text-end character-counter text-danger';
            } else {
                counter.className = 'form-text text-end character-counter';
            }
        }
        
        field.addEventListener('input', updateCounter);
        updateCounter();
    }
}

/**
 * Lazy Loading for Images
 */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/**
 * Notification System
 */
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show notification-toast`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('fade');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 150);
        }
    }, duration);
}

/**
 * Copy to Clipboard Functionality
 */
function copyToClipboard(text, button = null) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text).then(() => {
            if (button) {
                showCopyFeedback(button);
            }
            showNotification('Copiado para a área de transferência!', 'success', 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            fallbackCopyTextToClipboard(text, button);
        });
    } else {
        fallbackCopyTextToClipboard(text, button);
    }
}

function fallbackCopyTextToClipboard(text, button = null) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        if (button) {
            showCopyFeedback(button);
        }
        showNotification('Copiado para a área de transferência!', 'success', 2000);
    } catch (err) {
        console.error('Fallback: Could not copy text: ', err);
        showNotification('Erro ao copiar. Tente selecionar e copiar manualmente.', 'error');
    }
    
    document.body.removeChild(textArea);
}

function showCopyFeedback(button) {
    const originalContent = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.classList.add('btn-success');
    
    setTimeout(() => {
        button.innerHTML = originalContent;
        button.classList.remove('btn-success');
    }, 1000);
}

/**
 * Debounce Function
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * Form Auto-save (for long forms)
 */
function initAutoSave() {
    const longForms = document.querySelectorAll('form[data-autosave]');
    
    longForms.forEach(form => {
        const formId = form.getAttribute('data-autosave');
        const inputs = form.querySelectorAll('input, textarea, select');
        
        // Load saved data
        loadFormData(form, formId);
        
        // Save on input
        inputs.forEach(input => {
            input.addEventListener('input', debounce(() => {
                saveFormData(form, formId);
            }, 1000));
        });
        
        // Clear saved data on successful submit
        form.addEventListener('submit', () => {
            clearSavedFormData(formId);
        });
    });
}

function saveFormData(form, formId) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    localStorage.setItem(`form_${formId}`, JSON.stringify(data));
    showNotification('Rascunho salvo automaticamente', 'info', 2000);
}

function loadFormData(form, formId) {
    const savedData = localStorage.getItem(`form_${formId}`);
    if (savedData) {
        const data = JSON.parse(savedData);
        
        Object.keys(data).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input && input.type !== 'file') {
                input.value = data[key];
            }
        });
        
        showNotification('Rascunho restaurado', 'info', 3000);
    }
}

function clearSavedFormData(formId) {
    localStorage.removeItem(`form_${formId}`);
}

/**
 * Image Gallery Modal
 */
function initImageGallery() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            openImageModal(img.src, img.alt, index, galleryImages);
        });
    });
}

function openImageModal(src, alt, currentIndex, allImages) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${alt}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    <img src="${src}" alt="${alt}" class="img-fluid">
                    ${allImages.length > 1 ? `
                        <div class="mt-3">
                            <button class="btn btn-outline-secondary me-2" onclick="navigateImage(-1)">
                                <i class="fas fa-chevron-left"></i> Anterior
                            </button>
                            <span class="mx-3">${currentIndex + 1} de ${allImages.length}</span>
                            <button class="btn btn-outline-secondary ms-2" onclick="navigateImage(1)">
                                Próxima <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
    });
}

/**
 * Search Enhancement
 */
function initSearchEnhancement() {
    const searchInputs = document.querySelectorAll('input[type="search"], input[name="search"]');
    
    searchInputs.forEach(input => {
        // Add search icon
        if (!input.parentNode.querySelector('.search-icon')) {
            const icon = document.createElement('i');
            icon.className = 'fas fa-search search-icon';
            icon.style.cssText = `
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                color: #6c757d;
                pointer-events: none;
            `;
            
            input.parentNode.style.position = 'relative';
            input.style.paddingRight = '40px';
            input.parentNode.appendChild(icon);
        }
        
        // Add clear button when typing
        input.addEventListener('input', function() {
            let clearBtn = input.parentNode.querySelector('.search-clear');
            
            if (input.value && !clearBtn) {
                clearBtn = document.createElement('button');
                clearBtn.type = 'button';
                clearBtn.className = 'btn btn-sm search-clear';
                clearBtn.innerHTML = '<i class="fas fa-times"></i>';
                clearBtn.style.cssText = `
                    position: absolute;
                    right: 40px;
                    top: 50%;
                    transform: translateY(-50%);
                    border: none;
                    background: none;
                    color: #6c757d;
                `;
                
                clearBtn.addEventListener('click', () => {
                    input.value = '';
                    clearBtn.remove();
                    input.dispatchEvent(new Event('input'));
                });
                
                input.parentNode.appendChild(clearBtn);
            } else if (!input.value && clearBtn) {
                clearBtn.remove();
            }
        });
    });
}

// Initialize auto-save and search when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initAutoSave();
    initSearchEnhancement();
    initImageGallery();
});

// Global functions for external use
window.copyToClipboard = copyToClipboard;
window.showNotification = showNotification;

// Service Worker Registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/static/js/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Analytics (Google Analytics integration)
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

// Track page views
function trackPageView(page_title, page_location) {
    if (typeof gtag === 'function') {
        gtag('event', 'page_view', {
            page_title: page_title,
            page_location: page_location
        });
    }
}

// Track custom events
function trackEvent(event_name, parameters = {}) {
    if (typeof gtag === 'function') {
        gtag('event', event_name, parameters);
    }
}

// Export for use in other scripts
window.trackEvent = trackEvent;
window.trackPageView = trackPageView;
