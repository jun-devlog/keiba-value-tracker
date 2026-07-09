"""create_venues_bet_types_races_horses

Revision ID: 87f5add2b87e
Revises: 
Create Date: 2026-07-08 13:08:35.520558

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '87f5add2b87e'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # venues テーブル
    op.create_table(
        'venues',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.Column('code', sa.String(length=10), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('code'),
    )
    op.create_index(op.f('ix_venues_id'), 'venues', ['id'], unique=False)

    # bet_types テーブル
    op.create_table(
        'bet_types',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.Column('code', sa.String(length=10), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('code'),
    )
    op.create_index(op.f('ix_bet_types_id'), 'bet_types', ['id'], unique=False)

    # races テーブル
    op.create_table(
        'races',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('venue_id', sa.Integer(), nullable=False),
        sa.Column('race_date', sa.Date(), nullable=False),
        sa.Column('race_number', sa.Integer(), nullable=False),
        sa.Column('race_name', sa.String(length=100), nullable=True),
        sa.Column('grade', sa.String(length=10), nullable=True),
        sa.Column('distance', sa.Integer(), nullable=True),
        sa.Column('track_type', sa.String(length=10), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['venue_id'], ['venues.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_races_id'), 'races', ['id'], unique=False)
    op.create_index(op.f('ix_races_race_date'), 'races', ['race_date'], unique=False)
    op.create_index(op.f('ix_races_venue_id'), 'races', ['venue_id'], unique=False)

    # horses テーブル
    op.create_table(
        'horses',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('race_id', sa.Integer(), nullable=False),
        sa.Column('post_position', sa.Integer(), nullable=False),
        sa.Column('horse_name', sa.String(length=100), nullable=False),
        sa.Column('jockey', sa.String(length=50), nullable=True),
        sa.Column('odds', sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(['race_id'], ['races.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_horses_id'), 'horses', ['id'], unique=False)
    op.create_index(op.f('ix_horses_race_id'), 'horses', ['race_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_horses_race_id'), table_name='horses')
    op.drop_index(op.f('ix_horses_id'), table_name='horses')
    op.drop_table('horses')

    op.drop_index(op.f('ix_races_venue_id'), table_name='races')
    op.drop_index(op.f('ix_races_race_date'), table_name='races')
    op.drop_index(op.f('ix_races_id'), table_name='races')
    op.drop_table('races')

    op.drop_index(op.f('ix_bet_types_id'), table_name='bet_types')
    op.drop_table('bet_types')

    op.drop_index(op.f('ix_venues_id'), table_name='venues')
    op.drop_table('venues')
