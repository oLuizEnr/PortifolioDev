from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import StringField, TextAreaField, PasswordField, BooleanField, SelectField, DateField, URLField, SubmitField, ValidationError
from wtforms.validators import DataRequired, Email, Length, EqualTo, Optional, URL
from wtforms.widgets import TextArea
from models import User, Category

class LoginForm(FlaskForm):
    username = StringField('Nome de usuário ou email', validators=[DataRequired(), Length(min=3, max=80)])
    password = PasswordField('Senha', validators=[DataRequired()])
    remember_me = BooleanField('Lembrar de mim')
    submit = SubmitField('Entrar')

class RegisterForm(FlaskForm):
    username = StringField('Nome de usuário', validators=[DataRequired(), Length(min=3, max=80)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    first_name = StringField('Nome', validators=[DataRequired(), Length(min=2, max=50)])
    last_name = StringField('Sobrenome', validators=[DataRequired(), Length(min=2, max=50)])
    password = PasswordField('Senha', validators=[DataRequired(), Length(min=6)])
    password2 = PasswordField('Confirmar senha', validators=[DataRequired(), EqualTo('password', message='As senhas devem ser iguais')])
    submit = SubmitField('Cadastrar')
    
    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('Nome de usuário já existe. Escolha outro.')
    
    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('Email já cadastrado. Use outro email.')

class ForgotPasswordForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    submit = SubmitField('Enviar link de recuperação')

class ResetPasswordForm(FlaskForm):
    password = PasswordField('Nova senha', validators=[DataRequired(), Length(min=6)])
    password2 = PasswordField('Confirmar nova senha', validators=[DataRequired(), EqualTo('password', message='As senhas devem ser iguais')])
    submit = SubmitField('Redefinir senha')

class ProfileForm(FlaskForm):
    first_name = StringField('Nome', validators=[DataRequired(), Length(min=2, max=50)])
    last_name = StringField('Sobrenome', validators=[DataRequired(), Length(min=2, max=50)])
    bio = TextAreaField('Biografia', validators=[Optional(), Length(max=500)])
    profile_image = FileField('Foto do perfil', validators=[FileAllowed(['jpg', 'jpeg', 'png', 'gif'], 'Apenas imagens são permitidas!')])
    submit = SubmitField('Atualizar perfil')

class ProjectForm(FlaskForm):
    title = StringField('Título', validators=[DataRequired(), Length(min=3, max=200)])
    description = TextAreaField('Descrição resumida', validators=[DataRequired(), Length(min=10, max=500)])
    content = TextAreaField('Conteúdo detalhado', validators=[Optional()], widget=TextArea())
    category_id = SelectField('Categoria', coerce=int, validators=[Optional()])
    tags = StringField('Tags (separadas por vírgula)', validators=[Optional()])
    featured_image = FileField('Imagem principal', validators=[FileAllowed(['jpg', 'jpeg', 'png', 'gif'], 'Apenas imagens são permitidas!')])
    demo_url = URLField('URL da demonstração', validators=[Optional(), URL()])
    github_url = URLField('URL do GitHub', validators=[Optional(), URL()])
    technologies = StringField('Tecnologias utilizadas (separadas por vírgula)', validators=[Optional()])
    completion_date = DateField('Data de conclusão', validators=[Optional()])
    status = SelectField('Status', choices=[('draft', 'Rascunho'), ('published', 'Publicado')], default='draft')
    is_featured = BooleanField('Projeto em destaque')
    meta_title = StringField('Título SEO', validators=[Optional(), Length(max=200)])
    meta_description = TextAreaField('Descrição SEO', validators=[Optional(), Length(max=300)])
    submit = SubmitField('Salvar projeto')
    
    def __init__(self, *args, **kwargs):
        super(ProjectForm, self).__init__(*args, **kwargs)
        self.category_id.choices = [('', 'Selecione uma categoria')] + [(str(c.id), c.name) for c in Category.query.all()]

class AchievementForm(FlaskForm):
    title = StringField('Título', validators=[DataRequired(), Length(min=3, max=200)])
    description = TextAreaField('Descrição', validators=[DataRequired(), Length(min=10)])
    organization = StringField('Organização', validators=[Optional(), Length(max=200)])
    date_achieved = DateField('Data da conquista', validators=[Optional()])
    certificate_url = URLField('URL do certificado', validators=[Optional(), URL()])
    image = FileField('Imagem', validators=[FileAllowed(['jpg', 'jpeg', 'png', 'gif'], 'Apenas imagens são permitidas!')])
    status = SelectField('Status', choices=[('draft', 'Rascunho'), ('published', 'Publicado')], default='draft')
    is_featured = BooleanField('Conquista em destaque')
    submit = SubmitField('Salvar conquista')

class CommentForm(FlaskForm):
    content = TextAreaField('Comentário', validators=[DataRequired(), Length(min=5, max=1000)])
    submit = SubmitField('Enviar comentário')

class CategoryForm(FlaskForm):
    name = StringField('Nome', validators=[DataRequired(), Length(min=2, max=50)])
    description = TextAreaField('Descrição', validators=[Optional(), Length(max=200)])
    submit = SubmitField('Salvar categoria')

class SiteSettingsForm(FlaskForm):
    site_title = StringField('Título do site', validators=[DataRequired(), Length(max=200)])
    site_description = TextAreaField('Descrição do site', validators=[DataRequired(), Length(max=500)])
    owner_name = StringField('Nome do proprietário', validators=[Optional(), Length(max=100)])
    owner_title = StringField('Título profissional', validators=[Optional(), Length(max=200)])
    owner_bio = TextAreaField('Biografia', validators=[Optional(), Length(max=1000)])
    owner_email = StringField('Email de contato', validators=[Optional(), Email()])
    owner_phone = StringField('Telefone', validators=[Optional(), Length(max=20)])
    owner_location = StringField('Localização', validators=[Optional(), Length(max=100)])
    owner_avatar = FileField('Avatar', validators=[FileAllowed(['jpg', 'jpeg', 'png', 'gif'], 'Apenas imagens são permitidas!')])
    linkedin_url = URLField('LinkedIn URL', validators=[Optional(), URL()])
    github_url = URLField('GitHub URL', validators=[Optional(), URL()])
    twitter_url = URLField('Twitter URL', validators=[Optional(), URL()])
    instagram_url = URLField('Instagram URL', validators=[Optional(), URL()])
    meta_keywords = TextAreaField('Palavras-chave SEO (separadas por vírgula)', validators=[Optional()])
    google_analytics_id = StringField('Google Analytics ID', validators=[Optional(), Length(max=50)])
    submit = SubmitField('Salvar configurações')
